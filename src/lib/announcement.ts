import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface Announcement {
  id?: string;
  text: string;
  format?: string;
  isActive: boolean;
  createdAt: number;
}

const getDocRef = () => doc(db, "settings", "announcement");

const getRawData = async (): Promise<{ list: Announcement[] }> => {
  const snap = await getDoc(getDocRef());
  if (!snap.exists()) return { list: [] };
  
  const data = snap.data();
  // Handle backwards compatibility: if the doc only has { text, isActive }
  if (data.text !== undefined && data.list === undefined) {
    return {
      list: [{ 
        id: "legacy", 
        text: data.text, 
        isActive: data.isActive, 
        createdAt: Date.now(), 
        format: "Modal Popup" 
      }]
    };
  }
  return { list: data.list || [] };
};

// For Layout.tsx: Get the single most recent active announcement
export const getAnnouncement = async (): Promise<Announcement | null> => {
  try {
    const data = await getRawData();
    const activeList = data.list.filter(a => a.isActive).sort((a, b) => b.createdAt - a.createdAt);
    return activeList.length > 0 ? activeList[0] : null;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return null;
  }
};

// For Admin.tsx: Get all campaigns
export const getCampaigns = async (): Promise<Announcement[]> => {
  try {
    const data = await getRawData();
    return data.list.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return [];
  }
};

// Create a new campaign
export const addCampaign = async (data: Omit<Announcement, "id" | "createdAt">): Promise<void> => {
  const current = await getRawData();
  const newCampaign: Announcement = {
    ...data,
    id: Date.now().toString(),
    createdAt: Date.now(),
  };
  current.list.push(newCampaign);
  await setDoc(getDocRef(), { list: current.list });
};

// Delete a campaign
export const deleteCampaign = async (id: string): Promise<void> => {
  const current = await getRawData();
  const filtered = current.list.filter(c => c.id !== id);
  await setDoc(getDocRef(), { list: filtered });
};
