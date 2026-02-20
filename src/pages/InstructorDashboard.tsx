'use client'

import React from 'react'
import type { Curriculum } from '../lib/types'
import AccordionPhase from '../components/AccordionPhase'

type Props = {
  curriculum: Curriculum
  onSelectLesson: (id: string) => void
  completed: string[]
}

export default function InstructorDashboard({ curriculum, onSelectLesson, completed }: Props) {
  if (!curriculum?.instructors) return null

  return (
    <div className="space-y-4">
      {curriculum.instructors.map((inst) => (
        <div key={inst.id} className="border border-border rounded p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{inst.name}</div>
              <div className="text-sm text-secondaryText">Markets: {inst.markets.length}</div>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {inst.markets.map((m) => (
              <div key={m.id}>
                <div className="font-medium">{m.title}</div>
                <div className="pl-2 mt-2 space-y-2">
                  {m.strategies.map((s) => (
                    <div key={s.id} className="">
                      <div className="text-sm font-medium">{s.title}</div>
                      <div className="pl-2 mt-2 space-y-2">
                        {s.phases.map((p) => (
                          <AccordionPhase key={p.id} phase={p} onSelectLesson={onSelectLesson} completed={completed} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
