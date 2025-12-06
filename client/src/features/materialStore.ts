
import { create } from 'zustand';
import { apiRequest } from '@/lib/queryClient';
import { LaminateCodeGodown, MasterSettingsMemory, PlywoodBrandMemory } from '@shared/schema';

interface MaterialState {
    // Master Settings Data
    masterSettings: MasterSettingsMemory | null;
    plywoodOptions: PlywoodBrandMemory[];
    laminateOptions: LaminateCodeGodown[];

    // Loading States
    isLoadingMasterSettings: boolean;
    isLoadingMaterials: boolean;

    // Actions
    fetchMasterSettings: () => Promise<void>;
    saveMasterSettings: (settings: Partial<MasterSettingsMemory>) => Promise<void>;

    fetchMaterials: () => Promise<void>;

    // Optimistic updates + API calls
    addLaminate: (code: string, name?: string) => Promise<void>;
    addPlywood: (brand: string) => Promise<void>;
}

export const useMaterialStore = create<MaterialState>((set, get) => ({
    masterSettings: null,
    plywoodOptions: [],
    laminateOptions: [],

    isLoadingMasterSettings: false,
    isLoadingMaterials: false,

    fetchMasterSettings: async () => {
        set({ isLoadingMasterSettings: true });
        try {
            const response = await fetch('/api/master-settings-memory');
            if (!response.ok) throw new Error('Failed to fetch master settings');
            const data = await response.json();
            set({ masterSettings: data });
        } catch (error) {
            console.error('Error fetching master settings:', error);
        } finally {
            set({ isLoadingMasterSettings: false });
        }
    },

    saveMasterSettings: async (settings) => {
        // Optimistic update could go here if needed, but for settings, standard async is usually fine
        try {
            // Merge current settings with new ones for the request
            const current = get().masterSettings || {};
            const payload = { ...current, ...settings };

            const response = await apiRequest('POST', '/api/master-settings-memory', payload);
            const data = await response.json();
            set({ masterSettings: data });
        } catch (error) {
            console.error('Error saving master settings:', error);
            // Ideally rollback state here if we did optimistic update
        }
    },

    fetchMaterials: async () => {
        set({ isLoadingMaterials: true });
        try {
            const [plywoodRes, laminateRes] = await Promise.all([
                fetch('/api/plywood-brand-memory'),
                fetch('/api/laminate-code-godown')
            ]);

            const plywoodData = await plywoodRes.json();
            const laminateData = await laminateRes.json();

            set({
                plywoodOptions: Array.isArray(plywoodData) ? plywoodData : [],
                laminateOptions: Array.isArray(laminateData) ? laminateData : []
            });
        } catch (error) {
            console.error('Error fetching materials:', error);
        } finally {
            set({ isLoadingMaterials: false });
        }
    },

    addLaminate: async (code, name) => {
        const codeName = name || code;
        // Optimistic update
        const tempItem: LaminateCodeGodown = {
            id: -1, // temporary ID
            code,
            name: codeName,
            woodGrainsEnabled: 'false',
            createdAt: new Date(),
            updatedAt: new Date(),
            innerCode: null,
            supplier: null,
            thickness: null,
            description: null
        };

        set(state => ({
            laminateOptions: [...state.laminateOptions, tempItem]
        }));

        try {
            await apiRequest('POST', '/api/laminate-code-godown', { code: code, name: codeName });
            // Re-fetch to get the real ID and consistent state
            await get().fetchMaterials();
        } catch (error) {
            console.error('Error adding laminate:', error);
            // Rollback
            set(state => ({
                laminateOptions: state.laminateOptions.filter(opt => opt.code !== code)
            }));
        }
    },

    addPlywood: async (brand) => {
        // Optimistic update
        const tempItem: PlywoodBrandMemory = {
            id: -1,
            brand,
            createdAt: new Date()
        };

        set(state => ({
            plywoodOptions: [...state.plywoodOptions, tempItem]
        }));

        try {
            await apiRequest('POST', '/api/plywood-brand-memory', { brand });
            await get().fetchMaterials(); // Re-fetch to ensure sync
        } catch (error) {
            console.error('Error adding plywood brand:', error);
            set(state => ({
                plywoodOptions: state.plywoodOptions.filter(opt => opt.brand !== brand)
            }));
        }
    }
}));
