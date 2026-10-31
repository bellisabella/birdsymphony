'use client'

import dynamic from 'next/dynamic'

export const AtlasMapLazy = dynamic(() => import('@/components/atlas/atlas-map'), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center bg-card/40 text-sm text-muted-foreground">
      正在加载地图…
    </div>
  ),
})
