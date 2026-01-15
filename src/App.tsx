import { useState } from 'react';
import { PlusCircle, Image, Settings as SettingsIcon } from 'lucide-react';
import { CreatePoster } from './components/CreatePoster';
import { Gallery } from './components/Gallery';
import { Settings } from './components/Settings';
import { PosterDraft } from './lib/types';

type Tab = 'create' | 'gallery' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('create');
  const [editingDraft, setEditingDraft] = useState<PosterDraft | null>(null);

  const handleEditDraft = (draft: PosterDraft) => {
    setEditingDraft(draft);
    setActiveTab('create');
  };

  const handleDraftSaved = () => {
    setEditingDraft(null);
  };

  const tabs = [
    { id: 'create' as Tab, label: 'Create Poster', icon: PlusCircle },
    { id: 'gallery' as Tab, label: 'Gallery', icon: Image },
    { id: 'settings' as Tab, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sport Predictions Poster
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Create stunning prediction posters for social media
              </p>
            </div>
          </div>

          <div className="flex gap-2 pb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id !== 'create') {
                      setEditingDraft(null);
                    }
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'create' && (
          <CreatePoster
            initialDraft={editingDraft}
            onSaved={handleDraftSaved}
          />
        )}
        {activeTab === 'gallery' && <Gallery onEditDraft={handleEditDraft} />}
        {activeTab === 'settings' && <Settings />}
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="font-semibold mb-2">
              Create professional prediction posters in seconds
            </p>
            <p className="text-sm">
              No gambling language. Perfect for Cricket, Tennis, Basketball & Soccer picks.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
