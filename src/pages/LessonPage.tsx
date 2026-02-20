'use client'

import React, { useEffect, useState } from 'react'
import { findLessonById } from '../lib/curriculumEngine'
import type { Lesson } from '../lib/types'
import LessonPlayer from '../components/LessonPlayer'

function parseHash() {
  if (typeof window === 'undefined') return null
  const h = window.location.hash || ''
  const m = h.match(/^#\/lesson\/(.+)$/)
  return m ? decodeURIComponent(m[1]) : null
}

export default function LessonPage() {
  const [lessonId, setLessonId] = useState<string | null>(parseHash())
  const [lesson, setLesson] = useState<Lesson | null>(lessonId ? findLessonById(lessonId) ?? null : null)

  useEffect(() => {
    function onHash() {
      const id = parseHash()
      setLessonId(id)
      setLesson(id ? findLessonById(id) ?? null : null)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (!lesson) return <div className="bg-panel border border-border rounded p-4">Lesson not found.</div>

  return (
    <div className="bg-panel border border-border rounded p-4">
      <h2 className="font-semibold">{lesson.title}</h2>
      <LessonPlayer lesson={lesson} />
    </div>
  )
}
