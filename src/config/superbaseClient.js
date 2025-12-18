
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export const saveProjectToCloud = async (projectData) => {
    try{
        const {data, error} = await supabase 
        .from('projects')
        .insert([{
            data: projectData
        }])
        .select()
        .single();

        if (error) throw error; 
           return data.id;
        }
        catch (e) {
            console.error('Error saving to Supabase:', e);
            throw e;
    }
};


export const getProjectFromCloud = async (id) => {
    try{
        const { data, error} = await supabase
        .from('projects')
        .select('data')
        .eq('id', id)
        .single();

        if (error) return null;
        return data.data;
    } catch (e) {
        console.error("Error loading from supabase:", e);
        return null;
    }
};


export default supabase;
