"use client"

import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type BotSettingsProps = {
  title: string
  settings: {
    temperature: number
    topK: number
    topP: number
    modelId: string
  }
  setSettings: (settings: any) => void
}

export function BotSettings({ title, settings, setSettings }: BotSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor={`${title.replace(/\s+/g, "-").toLowerCase()}-model-id`}>Model ID</Label>
          <Input
            id={`${title.replace(/\s+/g, "-").toLowerCase()}-model-id`}
            value={settings.modelId}
            onChange={(e) => setSettings({ ...settings, modelId: e.target.value })}
            placeholder="e.g., gpt-3.5-turbo, gpt-4, etc."
          />
          <p className="text-xs text-muted-foreground">Specify the model ID to use (e.g., gpt-3.5-turbo, gpt-4)</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Temperature: {settings.temperature.toFixed(1)}</label>
          </div>
          <Slider
            value={[settings.temperature]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={(value) => setSettings({ ...settings, temperature: value[0] })}
          />
          <p className="text-xs text-muted-foreground">
            Controls randomness: Lower values are more deterministic, higher values more creative.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Top-K: {settings.topK}</label>
          </div>
          <Slider
            value={[settings.topK]}
            min={1}
            max={100}
            step={1}
            onValueChange={(value) => setSettings({ ...settings, topK: value[0] })}
          />
          <p className="text-xs text-muted-foreground">Limits vocabulary to top K tokens at each step.</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Top-P: {settings.topP.toFixed(1)}</label>
          </div>
          <Slider
            value={[settings.topP]}
            min={0.1}
            max={1}
            step={0.1}
            onValueChange={(value) => setSettings({ ...settings, topP: value[0] })}
          />
          <p className="text-xs text-muted-foreground">
            Nucleus sampling: Only consider tokens with combined probability P.
          </p>
        </div>
      </div>
    </div>
  )
}
