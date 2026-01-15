import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { getSettings, saveSettings, DEFAULT_SETTINGS } from '../lib/storage';
import { AppSettings, Sport } from '../lib/types';
import { getThemesForSport } from '../lib/themes';

export function Settings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings(DEFAULT_SETTINGS);
      saveSettings(DEFAULT_SETTINGS);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const sports: Sport[] = ['cricket', 'tennis', 'basketball', 'soccer'];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Settings</h2>
        <p className="text-gray-600">Customize your poster generation experience</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Brand Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Watermark Name
              </label>
              <input
                type="text"
                value={settings.watermarkName}
                onChange={(e) =>
                  updateSettings({ watermarkName: e.target.value })
                }
                placeholder="Your name or brand"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will appear on your generated posters
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Accent Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) =>
                    updateSettings({ accentColor: e.target.value })
                  }
                  className="w-20 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.accentColor}
                  onChange={(e) =>
                    updateSettings({ accentColor: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="font-semibold">Show Watermark</label>
                <p className="text-xs text-gray-500">
                  Display your watermark on posters
                </p>
              </div>
              <button
                onClick={() =>
                  updateSettings({ showWatermark: !settings.showWatermark })
                }
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.showWatermark ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.showWatermark ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Default Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Default Aspect Ratio
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => updateSettings({ defaultAspect: 'square' })}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                    settings.defaultAspect === 'square'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Square (1080x1080)
                </button>
                <button
                  onClick={() => updateSettings({ defaultAspect: 'story' })}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                    settings.defaultAspect === 'story'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Story (1080x1920)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                Default Themes by Sport
              </label>
              <div className="space-y-3">
                {sports.map((sport) => {
                  const sportIcon = {
                    cricket: '🏏',
                    tennis: '🎾',
                    basketball: '🏀',
                    soccer: '⚽',
                  };
                  const themes = getThemesForSport(sport);

                  return (
                    <div key={sport} className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-32">
                        <span className="text-2xl">{sportIcon[sport]}</span>
                        <span className="font-semibold capitalize">{sport}</span>
                      </div>
                      <select
                        value={settings.defaultThemes[sport]}
                        onChange={(e) =>
                          updateSettings({
                            defaultThemes: {
                              ...settings.defaultThemes,
                              [sport]: e.target.value,
                            },
                          })
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {themes.map((theme) => (
                          <option key={theme.id} value={theme.id}>
                            {theme.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={20} />
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            <RefreshCw size={20} />
            Reset
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-2">About Storage</h3>
        <p className="text-sm text-blue-800">
          All your drafts and generated posters are stored locally in your browser.
          Data is limited to 50 items maximum to prevent storage issues. Delete old
          items if you encounter storage warnings.
        </p>
      </div>
    </div>
  );
}
