"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { Search, Download, Loader2, Music, Video, ChevronDown, Scissors, X } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

interface VideoInfo {
  title: string
  thumbnail: string
  duration: string
  author: string
  formats: {
    mp3: string[]
    mp4: string[]
  }
}

function isValidYoutubeUrl(url: string) {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/
  return regex.test(url)
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/[<>:"/\\|?*]/g, "_").trim() || "download"
}

export function ConverterSection() {
  const { t } = useLocale()
  const [url, setUrl] = useState("")
  const [format, setFormat] = useState<"mp3" | "mp4">("mp4")
  const [isLoading, setIsLoading] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [selectedQuality, setSelectedQuality] = useState("")
  const [error, setError] = useState("")
  
  // Cut functionality states
  const [showCutPopup, setShowCutPopup] = useState(false)
  const [startTime, setStartTime] = useState("00:00:00")
  const [endTime, setEndTime] = useState("00:00:00")
  const [isCutEnabled, setIsCutEnabled] = useState(false)

  // Progress animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isConverting) {
      setProgress(0)
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev
          return prev + Math.random() * 5
        })
      }, 500)
    } else {
      setProgress(0)
    }
    return () => clearInterval(interval)
  }, [isConverting])

  const handleFetchInfo = useCallback(async () => {
    if (!url.trim()) return
    if (!isValidYoutubeUrl(url)) {
      setError(t("errorInvalidUrl"))
      return
    }

    setError("")
    setIsLoading(true)
    setVideoInfo(null)
    setSelectedQuality("")
    setIsCutEnabled(false)

    try {
      const res = await fetch("/api/video-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      if (!res.ok) throw new Error("Failed to fetch")

      const data = await res.json()
      setVideoInfo(data)
      setEndTime(data.duration || "00:00:00")
      setStartTime("00:00:00")

      if (format === "mp3" && data.formats.mp3.length > 0) {
        setSelectedQuality(data.formats.mp3[data.formats.mp3.length - 1])
      } else if (format === "mp4" && data.formats.mp4.length > 0) {
        setSelectedQuality(data.formats.mp4[data.formats.mp4.length - 1])
      }
    } catch {
      setError(t("errorFetch"))
    } finally {
      setIsLoading(false)
    }
  }, [url, format, t])

  const handleDownload = useCallback(async () => {
    if (!videoInfo || !selectedQuality) return

    setIsConverting(true)
    setError("")
    
    try {
      let downloadUrl = `/api/convert?url=${encodeURIComponent(url)}&format=${format}&quality=${encodeURIComponent(selectedQuality)}`
      
      if (isCutEnabled) {
        downloadUrl += `&start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}`
      }
      
      const response = await fetch(downloadUrl)
      if (!response.ok) throw new Error("Download failed")
      
      setProgress(100)
      
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      
      const fileName = `${sanitizeFilename(videoInfo.title)}${isCutEnabled ? "_cut" : ""}.${format}`
      
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error(err)
      setError(t("errorConversion"))
    } finally {
      setTimeout(() => {
        setIsConverting(false)
        setProgress(0)
      }, 500)
    }
  }, [videoInfo, selectedQuality, url, format, t, isCutEnabled, startTime, endTime])

  const qualities = videoInfo ? (format === "mp3" ? videoInfo.formats.mp3 : videoInfo.formats.mp4) : []

  return (
    <section className="relative px-4 pb-12 pt-16 sm:px-6 md:pt-24 overflow-x-hidden">
      <div className="mx-auto max-w-6xl text-center">
        {/* Hero text */}
        <h1 className="font-display text-4xl font-bold leading-tight text-[hsl(0,0%,95%)] sm:text-5xl md:text-6xl whitespace-nowrap">
          <span>{t("heroTitle")}</span>{" "}
          <span className="bg-gradient-to-r from-[hsl(265,80%,50%)] to-[hsl(280,85%,65%)] bg-clip-text text-transparent">
            {t("heroTitleHighlight")}
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-[hsl(260,10%,55%)] sm:text-lg">{t("heroSubtitle")}</p>

        {/* Converter input area */}
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-[hsl(260,20%,18%)] bg-[hsl(260,25%,10%)/0.8] p-1.5 shadow-xl shadow-[hsl(265,80%,50%)/0.05] backdrop-blur-sm">
          <div className="flex flex-col gap-2 sm:flex-row">
            {/* URL Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[hsl(260,10%,40%)]" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetchInfo()}
                placeholder={t("inputPlaceholder")}
                className="w-full rounded-xl bg-[hsl(260,20%,14%)] py-3.5 pl-11 pr-4 text-sm text-[hsl(0,0%,90%)] outline-none ring-1 ring-transparent transition-all placeholder:text-[hsl(260,10%,35%)] focus:ring-[hsl(265,80%,50%)/0.5]"
                aria-label={t("inputPlaceholder")}
              />
            </div>

            {/* Format selector */}
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(260,10%,40%)] group-focus-within:text-[hsl(265,80%,65%)] transition-colors pointer-events-none">
                {format === "mp4" ? <Video className="h-4 w-4" /> : <Music className="h-4 w-4" />}
              </div>
              <select
                value={format}
                onChange={(e) => {
                  const newFormat = e.target.value as "mp3" | "mp4"
                  setFormat(newFormat)
                  if (videoInfo) {
                    const q = newFormat === "mp3" ? videoInfo.formats.mp3 : videoInfo.formats.mp4
                    setSelectedQuality(q.length > 0 ? q[q.length - 1] : "")
                  }
                }}
                className="h-full w-full appearance-none rounded-xl bg-[hsl(260,20%,14%)] py-3.5 pl-10 pr-10 text-sm font-medium text-[hsl(0,0%,90%)] outline-none ring-1 ring-transparent transition-all focus:ring-[hsl(265,80%,50%)/0.5] sm:w-32"
                aria-label={t("formatLabel")}
              >
                <option value="mp4">MP4</option>
                <option value="mp3">MP3</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(260,10%,40%)]" />
            </div>

            {/* Convert button */}
            <button
              onClick={handleFetchInfo}
              disabled={isLoading || !url.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[hsl(265,80%,50%)] to-[hsl(280,85%,55%)] px-6 py-3.5 text-sm font-display text-[hsl(0,0%,100%)] shadow-lg shadow-[hsl(265,80%,50%)/0.25] transition-all hover:shadow-xl hover:shadow-[hsl(265,80%,50%)/0.4] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="whitespace-nowrap">{t("fetchingInfo")}</span>
                </>
              ) : (
                <span>{t("convertButton")}</span>
              )}
            </button>
          </div>
        </div>

        {/* Terms Acceptance Notice */}
        <p className="mx-auto mt-4 max-w-3xl text-left text-xs text-[hsl(260,10%,50%)] px-1.5">
          {t("termsAcceptancePre")}{" "}
          <Link
            href="/terms"
            className="font-medium text-[hsl(265,80%,65%)] transition-colors hover:text-[hsl(265,80%,75%)] hover:underline"
          >
            {t("termsAcceptanceLink")}
          </Link>
        </p>

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-lg border border-[hsl(0,60%,30%)] bg-[hsl(0,60%,15%)/0.5] px-4 py-2.5 text-sm text-[hsl(0,80%,65%)]">
            {error}
          </div>
        )}

        {/* Loading spinner */}
        {isLoading && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[hsl(265,80%,50%)]" />
              <div
                className="absolute inset-2 rounded-full border-4 border-transparent border-t-[hsl(280,85%,55%)]"
                style={{ animation: "spin 1.5s linear infinite reverse" }}
              />
            </div>
            <p className="text-sm text-[hsl(260,10%,55%)]">{t("fetchingInfo")}</p>
          </div>
        )}

        {/* Video Info Card */}
        {videoInfo && !isLoading && (
          <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-[hsl(260,20%,18%)] bg-[hsl(260,25%,10%)/0.8] backdrop-blur-sm">
            <div className="flex flex-col gap-5 p-5 sm:flex-row">
              {/* Thumbnail */}
              <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl sm:w-64">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="h-full w-full object-cover"
                />
                {videoInfo.duration && (
                  <span className="absolute bottom-2 right-2 rounded-md bg-[hsl(0,0%,0%)/0.8] px-2 py-0.5 text-xs font-medium text-[hsl(0,0%,95%)]">
                    {videoInfo.duration}
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(265,80%,50%)/0.9] shadow-lg">
                    {format === "mp3" ? <Music className="h-5 w-5 text-[hsl(0,0%,100%)]" /> : <Video className="h-5 w-5 text-[hsl(0,0%,100%)]" />}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-4 text-left">
                <div>
                  <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[hsl(0,0%,92%)]">{videoInfo.title}</h3>
                  {videoInfo.author && <p className="mt-1 text-sm text-[hsl(260,10%,50%)]">{videoInfo.author}</p>}
                </div>

                {/* Quality selector and Cut button */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[hsl(260,10%,45%)]">{t("qualityLabel")}</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <select
                        value={selectedQuality}
                        onChange={(e) => setSelectedQuality(e.target.value)}
                        className="w-full appearance-none rounded-lg bg-[hsl(260,20%,14%)] px-4 py-2.5 pr-10 text-sm text-[hsl(0,0%,90%)] outline-none ring-1 ring-[hsl(260,20%,22%)] transition-all focus:ring-[hsl(265,80%,50%)/0.5]"
                      >
                        {qualities.map((q) => (
                          <option key={q} value={q}>
                            {q}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(260,10%,40%)]" />
                    </div>
                    
                    {/* Scissors Button */}
                    <button
                      onClick={() => setShowCutPopup(true)}
                      title={t("cutTooltip")}
                      className={`flex h-[42px] w-[42px] items-center justify-center rounded-lg transition-all ${
                        isCutEnabled 
                          ? "bg-[hsl(265,80%,50%)] text-white shadow-lg shadow-[hsl(265,80%,50%)/0.3]" 
                          : "bg-[hsl(260,20%,14%)] text-[hsl(260,10%,50%)] hover:bg-[hsl(260,20%,18%)] hover:text-[hsl(265,80%,65%)] ring-1 ring-[hsl(260,20%,22%)]"
                      }`}
                    >
                      <Scissors className={`h-5 w-5 ${isCutEnabled ? "animate-pulse" : ""}`} />
                    </button>
                  </div>
                  
                  {isCutEnabled && (
                    <p className="mt-1.5 text-[10px] text-[hsl(265,80%,65%)] font-medium">
                      {t("cutPopupTitle")}: {startTime} - {endTime}
                    </p>
                  )}
                </div>

                {/* Download button with Horizontal Water Fill Animation */}
                <button
                  onClick={handleDownload}
                  disabled={isConverting || !selectedQuality}
                  className="relative mt-auto flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-[hsl(260,20%,14%)] px-6 py-3 text-sm font-display text-[hsl(0,0%,100%)] ring-1 ring-[hsl(260,20%,22%)] transition-all hover:shadow-lg disabled:cursor-not-allowed"
                >
                  {/* Default Background Gradient */}
                  {!isConverting && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[hsl(265,80%,50%)] to-[hsl(280,85%,55%)] opacity-100 transition-opacity" />
                  )}

                  {/* Horizontal Water Fill Animation */}
                  {isConverting && (
                    <div 
                      className="absolute bottom-0 left-0 top-0 bg-gradient-to-r from-[hsl(265,80%,50%)] to-[hsl(280,85%,55%)] transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    >
                      {/* Horizontal Wave Effect at the right edge of progress */}
                      <div className="absolute -right-[20px] top-1/2 h-[200%] w-[40px] -translate-y-1/2 animate-wave-h rounded-[40%] bg-[hsl(265,80%,50%)] opacity-50" />
                      <div className="absolute -right-[15px] top-1/2 h-[210%] w-[40px] -translate-y-1/2 animate-wave-h rounded-[38%] bg-[hsl(280,85%,55%)] opacity-30" style={{ animationDelay: '1s' }} />
                    </div>
                  )}

                  {/* Button Content */}
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {isConverting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{t("converting")} {Math.round(progress)}%</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>{t("downloadButton")}</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cut Popup Modal */}
      {showCutPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[hsl(260,20%,18%)] bg-[hsl(260,25%,10%)] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[hsl(260,20%,18%)] px-6 py-4">
              <div className="flex items-center gap-2">
                <Scissors className="h-5 w-5 text-[hsl(265,80%,65%)]" />
                <h3 className="font-display text-lg font-semibold text-[hsl(0,0%,95%)]">{t("cutPopupTitle")}</h3>
              </div>
              <button 
                onClick={() => setShowCutPopup(false)}
                className="rounded-full p-1 text-[hsl(260,10%,40%)] hover:bg-[hsl(260,20%,14%)] hover:text-[hsl(0,0%,90%)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-[hsl(260,10%,45%)]">{t("startTime")}</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="00:00:00"
                    className="w-full rounded-lg bg-[hsl(260,20%,14%)] px-4 py-2.5 text-sm text-[hsl(0,0%,90%)] outline-none ring-1 ring-[hsl(260,20%,22%)] transition-all focus:ring-[hsl(265,80%,50%)/0.5]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-[hsl(260,10%,45%)]">{t("endTime")}</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="00:00:00"
                    className="w-full rounded-lg bg-[hsl(260,20%,14%)] px-4 py-2.5 text-sm text-[hsl(0,0%,90%)] outline-none ring-1 ring-[hsl(260,20%,22%)] transition-all focus:ring-[hsl(265,80%,50%)/0.5]"
                  />
                </div>
              </div>
              
              <p className="mt-4 text-[11px] text-[hsl(260,10%,40%)] italic">
                * Formato: HH:MM:SS ou MM:SS
              </p>
              
              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsCutEnabled(true)
                    setShowCutPopup(false)
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-[hsl(265,80%,50%)] to-[hsl(280,85%,55%)] px-6 py-3 text-sm font-display font-medium text-[hsl(0,0%,100%)] shadow-lg shadow-[hsl(265,80%,50%)/0.2] transition-all hover:shadow-xl hover:shadow-[hsl(265,80%,50%)/0.3]"
                >
                  {t("confirmCut")}
                </button>
                <button
                  onClick={() => {
                    setIsCutEnabled(false)
                    setShowCutPopup(false)
                  }}
                  className="w-full rounded-xl bg-transparent px-6 py-3 text-sm font-display font-medium text-[hsl(260,10%,50%)] transition-all hover:bg-[hsl(260,20%,14%)] hover:text-[hsl(0,0%,90%)]"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
