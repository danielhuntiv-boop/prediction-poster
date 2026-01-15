import { useState, useEffect } from 'react';
import { Download, Trash2, FileEdit, Calendar } from 'lucide-react';
import { getPosters, deletePoster, getDrafts, deleteDraft } from '../lib/storage';
import { GeneratedPoster, PosterDraft } from '../lib/types';

interface GalleryProps {
  onEditDraft?: (draft: PosterDraft) => void;
}

export function Gallery({ onEditDraft }: GalleryProps) {
  const [posters, setPosters] = useState<GeneratedPoster[]>([]);
  const [drafts, setDrafts] = useState<PosterDraft[]>([]);
  const [activeTab, setActiveTab] = useState<'posters' | 'drafts'>('posters');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPosters(getPosters());
    setDrafts(getDrafts());
  };

  const handleDownloadPoster = (poster: GeneratedPoster) => {
    const link = document.createElement('a');
    link.download = `poster-${poster.id}.png`;
    link.href = poster.imageDataUrl;
    link.click();
  };

  const handleDeletePoster = (id: string) => {
    if (confirm('Are you sure you want to delete this poster?')) {
      deletePoster(id);
      loadData();
    }
  };

  const handleDeleteDraft = (id: string) => {
    if (confirm('Are you sure you want to delete this draft?')) {
      deleteDraft(id);
      loadData();
    }
  };

  const getSportIcon = (sport: string) => {
    const icons: Record<string, string> = {
      cricket: '🏏',
      tennis: '🎾',
      basketball: '🏀',
      soccer: '⚽',
    };
    return icons[sport] || '🎯';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Gallery</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('posters')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'posters'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Generated Posters ({posters.length})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'drafts'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Saved Drafts ({drafts.length})
          </button>
        </div>
      </div>

      {activeTab === 'posters' && (
        <div>
          {posters.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-lg">
                No posters generated yet. Create your first poster!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posters.map((poster) => (
                <div
                  key={poster.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={poster.imageDataUrl}
                      alt="Poster"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>
                        {new Date(poster.createdAt).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {poster.aspect}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadPoster(poster)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download size={16} />
                        Download
                      </button>
                      <button
                        onClick={() => handleDeletePoster(poster.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'drafts' && (
        <div>
          {drafts.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-lg">
                No drafts saved yet. Save your first draft!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getSportIcon(draft.sport)}</span>
                      <div>
                        <h3 className="font-bold text-lg">{draft.eventTitle}</h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {draft.sport}
                        </p>
                      </div>
                    </div>

                    {draft.pickText && (
                      <p className="text-sm font-semibold text-blue-600">
                        {draft.pickText}
                      </p>
                    )}

                    {draft.league && (
                      <p className="text-xs text-gray-600">{draft.league}</p>
                    )}

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={14} />
                      <span>
                        Updated: {new Date(draft.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-3 border-t">
                      <button
                        onClick={() => onEditDraft?.(draft)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FileEdit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
