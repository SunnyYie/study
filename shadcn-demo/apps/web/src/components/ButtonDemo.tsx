import { Button } from '@repo/ui'

function ButtonDemo() {
  return (
    <div className="p-8 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Button Variants</h2>

        <div className="flex gap-4 flex-wrap">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Button Sizes</h2>

        <div className="flex gap-4 items-center flex-wrap">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Button States</h2>

        <div className="flex gap-4 flex-wrap">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">As Child (Slot)</h2>

        <div className="flex gap-4 flex-wrap">
          <Button asChild>
            <a href="#" className="inline-block">
              Link Button
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ButtonDemo
