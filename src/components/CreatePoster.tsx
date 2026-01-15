import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import {
  Download,
  Share2,
  Save,
  Upload,
  X,
  Shuffle,
  Image as ImageIcon,
  Copy,
  Check,
} from 'lucide-react';
import { PosterDraft, Sport, AspectRatio, Layout, UploadedImage } from '../lib/types';
import { PosterCanvas } from './PosterCanvas';
import { saveDraft, savePoster, getSettings } from '../lib/storage';
import { getThemesForSport, getRandomTheme } from '../lib/themes';
import { getMarketsForSport } from '../lib/markets';
import { generateCaption } from '../lib/caption';

interface CreatePosterProps {
  initialDraft?: PosterDraft | null;
  onSaved?: () => void;
}

export function CreatePoster({ initialDraft, onSaved }: CreatePosterProps) {
  const settings = getSettings();
  const posterRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [draft, setDraft] = useState<PosterDraft>(
    initialDraft || {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sport: 'cricket',
      eventTitle: '',
      marketType: '',
      pickText: '',
      confidence: 3,
      images: [],
      layout: 'hero',
      aspect: settings.defaultAspect,
      themeId: settings.defaultThemes.cricket,
    }
  );

  const [selectedMarket, setSelectedMarket] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const sports: { id: Sport; label: string; icon: string; color: string }[] = [
    { id: 'cricket', label: 'Cricket', icon: '🏏', color: 'bg-green-600' },
    { id: 'tennis', label: 'Tennis', icon: '🎾', color: 'bg-blue-600' },
    { id: 'basketball', label: 'Basketball', icon: '🏀', color: 'bg-orange-600' },
    { id: 'soccer', label: 'Soccer', icon: '⚽', color: 'bg-emerald-600' },
  ];

  useEffect(() => {
    updatePickText();
  }, [selectedMarket, customValue, draft.teamA, draft.teamB, selectedPlayer]);

  const updateDraft = (updates: Partial<PosterDraft>) => {
    setDraft((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSportChange = (sport: Sport) => {
    const themes = getThemesForSport(sport);
    updateDraft({
      sport,
      themeId: themes[0]?.id || '',
      marketType: '',
      pickText: '',
    });
    setSelectedMarket('');
    setCustomValue('');
  };

  const updatePickText = () => {
    const markets = getMarketsForSport(draft.sport);
    const market = markets.find((m) => m.value === selectedMarket);
    if (!market) {
      updateDraft({ pickText: '' });
      return;
    }

    let pickText = '';

    if (market.requiresPlayer && selectedPlayer) {
      pickText = `${selectedPlayer} - ${market.label}`;
      if (market.requiresValue && customValue) {
        pickText += ` ${customValue}`;
      }
    } else if (market.requiresValue && customValue) {
      if (draft.teamA) {
        pickText = `${draft.teamA} - ${market.label} ${customValue}`;
      } else {
        pickText = `${market.label} ${customValue}`;
      }
    } else if (draft.teamA && draft.teamB) {
      pickText = `${draft.teamA} - ${market.label}`;
    } else {
      pickText = market.label;
    }

    updateDraft({ pickText, marketType: market.label });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files).slice(0, 3);

    fileArray.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newImage: UploadedImage = {
          id: Date.now().toString() + Math.random(),
          dataUrl,
          fileName: file.name,
        };

        setDraft((prev) => ({
          ...prev,
          images: [...prev.images, newImage].slice(0, 3),
          updatedAt: new Date().toISOString(),
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    updateDraft({
      images: draft.images.filter((img) => img.id !== id),
    });
  };

  const randomizeTheme = () => {
    const randomTheme = getRandomTheme(draft.sport);
    updateDraft({ themeId: randomTheme.id });
  };

  const handleSave = () => {
    saveDraft(draft);
    alert('Draft saved successfully!');
    onSaved?.();
  };

  const exportPoster = async (aspect: AspectRatio) => {
    if (!posterRef.current) return;

    setExporting(true);
    const originalAspect = draft.aspect;
    updateDraft({ aspect });

    setTimeout(async () => {
      try {
        if (!posterRef.current) return;

        const dataUrl = await toPng(posterRef.current, {
          quality: 1,
          pixelRatio: 1,
          cacheBust: true,
        });

        const link = document.createElement('a');
        link.download = `${draft.sport}-pick-${aspect}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();

        const poster = {
          id: Date.now().toString(),
          draftId: draft.id,
          createdAt: new Date().toISOString(),
          aspect,
          imageDataUrl: dataUrl,
          captionText: generateCaption(draft),
        };
        savePoster(poster);

        alert('Poster exported successfully!');
      } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export poster. Please try again.');
      } finally {
        updateDraft({ aspect: originalAspect });
        setExporting(false);
      }
    }, 100);
  };

  const copyCaption = () => {
    const caption = generateCaption(draft);
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToX = () => {
    const caption = generateCaption(draft);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const markets = getMarketsForSport(draft.sport);
  const selectedMarketData = markets.find((m) => m.value === selectedMarket);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Select Sport</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => handleSportChange(sport.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  draft.sport === sport.id
                    ? 'border-blue-500 bg-blue-50 scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-2">{sport.icon}</div>
                <div className="font-semibold text-sm">{sport.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Event Title *</label>
            <input
              type="text"
              value={draft.eventTitle}
              onChange={(e) => updateDraft({ eventTitle: e.target.value })}
              placeholder="e.g., Australia vs India"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                {draft.sport === 'tennis' ? 'Player A' : 'Team A'}
              </label>
              <input
                type="text"
                value={draft.teamA || ''}
                onChange={(e) => updateDraft({ teamA: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                {draft.sport === 'tennis' ? 'Player B' : 'Team B'}
              </label>
              <input
                type="text"
                value={draft.teamB || ''}
                onChange={(e) => updateDraft({ teamB: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">League/Tournament</label>
            <input
              type="text"
              value={draft.league || ''}
              onChange={(e) => updateDraft({ league: e.target.value })}
              placeholder="e.g., ICC World Cup"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Date/Time</label>
            <input
              type="datetime-local"
              value={draft.startTime || ''}
              onChange={(e) => updateDraft({ startTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Market Type *</label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select market...</option>
              {markets.map((market) => (
                <option key={market.value} value={market.value}>
                  {market.label}
                </option>
              ))}
            </select>
          </div>

          {selectedMarketData?.requiresPlayer && (
            <div>
              <label className="block text-sm font-semibold mb-2">Player Name</label>
              <input
                type="text"
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                placeholder="Enter player name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {selectedMarketData?.requiresValue && (
            <div>
              <label className="block text-sm font-semibold mb-2">
                {selectedMarketData.valueLabel || 'Value'}
              </label>
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="e.g., -4.5 or 21.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Confidence (1-5)
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={draft.confidence}
              onChange={(e) => updateDraft({ confidence: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span className="font-bold text-lg text-gray-900">{draft.confidence}</span>
              <span>High</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Notes (max 120 chars)</label>
            <textarea
              value={draft.notes || ''}
              onChange={(e) => updateDraft({ notes: e.target.value.slice(0, 120) })}
              maxLength={120}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {(draft.notes || '').length}/120
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Upload Photos (max 3)</label>
            <div className="space-y-3">
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <Upload size={20} />
                <span>Choose images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {draft.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {draft.images.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.dataUrl}
                        alt={img.fileName}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => updateDraft({ layout: 'hero' })}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border ${
                    draft.layout === 'hero'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  Hero
                </button>
                <button
                  onClick={() => updateDraft({ layout: 'split' })}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border ${
                    draft.layout === 'split'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  Split
                </button>
                <button
                  onClick={() => updateDraft({ layout: 'collage' })}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border ${
                    draft.layout === 'collage'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  Collage
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Theme</label>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {getThemesForSport(draft.sport).map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => updateDraft({ themeId: theme.id })}
                    className={`p-3 rounded-lg border-2 text-xs transition-all ${
                      draft.themeId === theme.id
                        ? 'border-blue-500 scale-105'
                        : 'border-gray-200'
                    }`}
                    style={{ background: theme.background }}
                  >
                    <span className="text-white font-semibold drop-shadow">
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={randomizeTheme}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <Shuffle size={18} />
                Randomize Theme
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Preview</h2>
          <div className="bg-gray-100 rounded-xl p-4 overflow-auto">
            <div
              className="mx-auto"
              style={{
                width: draft.aspect === 'square' ? '400px' : '225px',
                transform: draft.aspect === 'square' ? 'scale(0.37)' : 'scale(0.208)',
                transformOrigin: 'top center',
              }}
            >
              <PosterCanvas
                ref={posterRef}
                draft={draft}
                watermarkName={settings.watermarkName}
                showWatermark={settings.showWatermark}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => exportPoster('square')}
              disabled={exporting || !draft.eventTitle || !draft.pickText}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Download size={20} />
              Export Square
            </button>
            <button
              onClick={() => exportPoster('story')}
              disabled={exporting || !draft.eventTitle || !draft.pickText}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <ImageIcon size={20} />
              Export Story
            </button>
          </div>

          <button
            onClick={copyCaption}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            {copied ? 'Caption Copied!' : 'Copy Caption'}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={shareToX}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Share2 size={18} />
              Share to X
            </button>
            <button
              onClick={shareToFacebook}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Share2 size={18} />
              Facebook
            </button>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
            <p className="font-semibold text-yellow-800 mb-1">Instagram Note:</p>
            <p className="text-yellow-700">
              Instagram doesn't support direct web posting. Download the poster and upload
              it manually to Instagram, then paste the caption!
            </p>
          </div>

          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save size={20} />
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
}
