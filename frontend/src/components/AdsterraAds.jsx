import { useEffect, useState } from "react"
import { api } from "../services/api.js"

export default function AdsterraAds({ onAdStatusChange }) {
  const [ads, setAds] = useState({ nativeBanner: null, banner: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [adsReady, setAdsReady] = useState(false)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true)
        const adsData = await api.getCoinsPageAds()
        setAds(adsData)
        
        // Log what we got for debugging
        console.log("[ADS] Received placements:", adsData)
        
        const hasBannerIframe = adsData.banner?.type === "iframe" && adsData.banner?.url
        const hasBannerScript = adsData.banner?.type === "script" && adsData.banner?.script && adsData.banner?.key
        const hasNativeIframe = adsData.nativeBanner?.type === "iframe" && adsData.nativeBanner?.url
        const hasNativeScript = adsData.nativeBanner?.type === "script" && adsData.nativeBanner?.script

        // Check if we have any valid ads (either iframe with direct_url or script-based)
        const hasValidAds = hasBannerIframe || hasBannerScript || hasNativeIframe || hasNativeScript
        
        if (!hasValidAds) {
          setError("⚠️ No ads configured - Earning is temporarily disabled")
          setAdsReady(false)
          if (onAdStatusChange) {
            onAdStatusChange(false)
          }
        } else {
          console.log("[ADS] Placements ready:", {
            nativeBanner: adsData.nativeBanner ? `${adsData.nativeBanner.type} (${adsData.nativeBanner.title})` : "none",
            banner: adsData.banner ? `${adsData.banner.type} (${adsData.banner.title})` : "none"
          })
          
          setError("")
          setAdsReady(true)
          if (onAdStatusChange) {
            onAdStatusChange(true)
          }
        }
      } catch (err) {
        console.error("[ADS] Failed to load ads:", err)
        setError("Failed to load ads from Adsterra - cannot claim coins")
        setAdsReady(false)
        if (onAdStatusChange) {
          onAdStatusChange(false)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [onAdStatusChange])

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-red-800/60 bg-red-900/30 p-6">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}
      
      {/* Banner Ad Container */}
      {ads.banner && (
        <div className="rounded-2xl border border-slate-800/60 bg-ink-900/70 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-4">Sponsored</p>
          {ads.banner.type === "iframe" && ads.banner.url ? (
            // Iframe-based ad
            <iframe
              src={ads.banner.url}
              className="w-full rounded border-0"
              style={{ height: `${ads.banner.height}px` }}
              title={ads.banner.title}
              allow="autoplay"
              scrolling="no"
            />
          ) : ads.banner.type === "script" ? (
            // Script-based ad with atOptions
            <BannerScriptAd placement={ads.banner} />
          ) : (
            <div className="w-full h-[250px] rounded bg-slate-900/50 flex items-center justify-center text-slate-400">
              <span>Ad format not supported</span>
            </div>
          )}
        </div>
      )}

      {/* Native Banner Ad - Desktop only */}
      {ads.nativeBanner && (
        <div className="hidden lg:block rounded-2xl border border-slate-800/60 bg-ink-900/70 p-4">
          {ads.nativeBanner.type === "iframe" && ads.nativeBanner.url ? (
            // Iframe-based ad
            <iframe
              src={ads.nativeBanner.url}
              className="w-full rounded border-0"
              style={{ height: `${ads.nativeBanner.height}px` }}
              title={ads.nativeBanner.title}
              allow="autoplay"
              scrolling="no"
            />
          ) : ads.nativeBanner.type === "script" ? (
            // Script-based ad with container ID
            <NativeScriptAd placement={ads.nativeBanner} />
          ) : (
            <div className="w-full h-[120px] rounded bg-slate-900/50 flex items-center justify-center text-slate-400">
              <span>Ad format not supported</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Script-based banner ad component (uses atOptions)
function BannerScriptAd({ placement }) {
  const containerId = `adsterra-banner-${placement.id}`

  useEffect(() => {
    if (import.meta.env.MODE !== "production") {
      return
    }

    if (!placement.script || !placement.key) {
      console.warn("[ADS] Banner placement missing script or key")
      return
    }

    const container = document.getElementById(containerId)
    if (!container || container.innerHTML !== "") {
      return
    }

    console.log("[ADS] Injecting banner script ad:", {
      id: placement.id,
      title: placement.title,
      key: placement.key,
      script: placement.script,
      width: placement.width,
      height: placement.height
    })

    const optionsScript = document.createElement("script")
    optionsScript.type = "text/javascript"
    optionsScript.text = `
      atOptions = {
        'key' : '${placement.key}',
        'format' : '${placement.format || "iframe"}',
        'height' : ${placement.height || 60},
        'width' : ${placement.width || 468},
        'params' : {}
      };
    `

    const invokeScript = document.createElement("script")
    invokeScript.type = "text/javascript"
    invokeScript.async = true
    invokeScript.src = placement.script

    invokeScript.onerror = () => {
      console.error(`[ADS] Failed to load banner script from ${placement.script}`)
    }
    invokeScript.onload = () => {
      console.log("[ADS] Banner script loaded successfully")
    }

    container.appendChild(optionsScript)
    container.appendChild(invokeScript)

    return () => {
      if (optionsScript.parentNode === container) {
        container.removeChild(optionsScript)
      }
      if (invokeScript.parentNode === container) {
        container.removeChild(invokeScript)
      }
    }
  }, [placement, containerId])

  return (
    <div
      id={containerId}
      className="w-full rounded bg-slate-900/50 flex items-center justify-center text-slate-400"
      style={{ height: `${placement.height || 60}px`, minWidth: `${placement.width || 468}px` }}
    >
      <span>Loading ad...</span>
    </div>
  )
}

// Script-based native ad component (uses container ID)
function NativeScriptAd({ placement }) {
  const containerId = placement.containerId || `adsterra-native-${placement.id}`

  useEffect(() => {
    if (import.meta.env.MODE !== "production") {
      return
    }

    if (!placement.script) {
      console.warn("[ADS] Native placement missing script URL")
      return
    }

    const container = document.getElementById(containerId)
    if (!container || container.innerHTML !== "") {
      return
    }

    console.log("[ADS] Injecting native script ad:", {
      id: placement.id,
      title: placement.title,
      containerId: containerId,
      script: placement.script,
      width: placement.width,
      height: placement.height
    })

    const invokeScript = document.createElement("script")
    invokeScript.type = "text/javascript"
    invokeScript.async = true
    invokeScript.src = placement.script

    invokeScript.onerror = () => {
      console.error(`[ADS] Failed to load native script from ${placement.script}`)
    }
    invokeScript.onload = () => {
      console.log("[ADS] Native script loaded successfully")
    }

    container.appendChild(invokeScript)

    return () => {
      if (invokeScript.parentNode === container) {
        container.removeChild(invokeScript)
      }
    }
  }, [placement, containerId])

  return (
    <div
      id={containerId}
      className="w-full rounded bg-slate-900/50 flex items-center justify-center text-slate-400"
      style={{ height: `${placement.height || 60}px`, minWidth: `${placement.width || 468}px` }}
    >
      <span>Loading ad...</span>
    </div>
  )
}



