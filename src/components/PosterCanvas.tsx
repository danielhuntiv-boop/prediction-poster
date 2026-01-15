import { forwardRef } from 'react';
import { PosterDraft } from '../lib/types';
import { getThemeById } from '../lib/themes';
import { Trophy, Calendar, TrendingUp } from 'lucide-react';

interface PosterCanvasProps {
  draft: PosterDraft;
  watermarkName: string;
  showWatermark: boolean;
}

export const PosterCanvas = forwardRef<HTMLDivElement, PosterCanvasProps>(
  ({ draft, watermarkName, showWatermark }, ref) => {
    const theme = getThemeById(draft.themeId);
    const isStory = draft.aspect === 'story';
    const width = 1080;
    const height = isStory ? 1920 : 1080;

    if (!theme) {
      return <div>Theme not found</div>;
    }

    const getSportIcon = () => {
      const iconMap = {
        cricket: '🏏',
        tennis: '🎾',
        basketball: '🏀',
        soccer: '⚽',
      };
      return iconMap[draft.sport];
    };

    const renderImages = () => {
      if (draft.images.length === 0) return null;

      if (draft.layout === 'hero' && draft.images[0]) {
        return (
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <img
              src={draft.images[0].dataUrl}
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </div>
        );
      }

      if (draft.layout === 'split' && draft.images.length >= 1) {
        return (
          <div className="absolute top-[20%] left-0 right-0 flex justify-center gap-4 px-8">
            {draft.images.slice(0, 2).map((img, idx) => (
              <div
                key={img.id}
                className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20"
              >
                <img
                  src={img.dataUrl}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        );
      }

      if (draft.layout === 'collage' && draft.images.length >= 1) {
        return (
          <div className="absolute top-[15%] left-0 right-0 flex justify-center gap-3 px-8 flex-wrap">
            {draft.images.slice(0, 3).map((img, idx) => (
              <div
                key={img.id}
                className="w-36 h-36 rounded-xl overflow-hidden shadow-2xl border-3 border-white/20"
              >
                <img
                  src={img.dataUrl}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        );
      }

      return null;
    };

    return (
      <div
        ref={ref}
        className="relative overflow-hidden"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: theme.background,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: theme.pattern,
          }}
        />

        {renderImages()}

        <div
          className="relative z-10 flex flex-col justify-between h-full p-16"
          style={{ color: theme.textColor }}
        >
          <div className="space-y-8">
            <div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-3xl font-bold uppercase tracking-wider"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span className="text-4xl">{getSportIcon()}</span>
              {draft.sport} Pick
            </div>

            {draft.eventTitle && (
              <h1
                className="text-7xl font-black leading-tight"
                style={{
                  textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  lineHeight: '1.1',
                }}
              >
                {draft.eventTitle}
              </h1>
            )}

            {(draft.league || draft.startTime) && (
              <div className="flex items-center gap-6 text-2xl opacity-90">
                {draft.league && (
                  <div className="flex items-center gap-2">
                    <Trophy size={28} />
                    <span>{draft.league}</span>
                  </div>
                )}
                {draft.startTime && (
                  <div className="flex items-center gap-2">
                    <Calendar size={28} />
                    <span>{new Date(draft.startTime).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-8">
            {draft.pickText && (
              <div
                className="p-8 rounded-3xl"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(15px)',
                }}
              >
                <div className="flex items-center gap-3 text-2xl font-semibold mb-4 opacity-80">
                  <TrendingUp size={32} />
                  <span>THE PICK</span>
                </div>
                <p className="text-6xl font-black leading-tight">
                  {draft.pickText}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-semibold opacity-80">CONFIDENCE</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className="w-8 h-8 rounded-full"
                      style={{
                        backgroundColor:
                          star <= draft.confidence
                            ? theme.accentColor
                            : 'rgba(255, 255, 255, 0.2)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {showWatermark && (
                <div
                  className="text-2xl font-bold opacity-60"
                  style={{ color: theme.accentColor }}
                >
                  {watermarkName}
                </div>
              )}
            </div>

            {draft.notes && (
              <div
                className="p-6 rounded-2xl text-xl opacity-90"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                }}
              >
                {draft.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

PosterCanvas.displayName = 'PosterCanvas';
