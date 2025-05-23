"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import PlotsList from "@/components/plots/PlotsList";
import Search from "@/components/search/Search";
import { getAllPlots } from "../../lib/supabaseFunction";

import { Plot } from "@/types";

import TagSearch from "@/components/search/TagSearch";
import FavoriteManager from "@/components/FavoriteManager";


export default function Home() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    // 初期値をlocalStorageから取得
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const getPlots = async () => {
      const plots = await getAllPlots();
      setPlots(plots ?? []);
    };
    getPlots();
  }, []);

  // favoritesが変わるたびにlocalStorageへ保存
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const displayedPlots = showFavorites
    ? plots.filter((plot) => favorites.includes(plot.id))
    : plots;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h3 className="mt-50 text-center text-4xl mb-10">AI 検索</h3>
      <FavoriteManager />
    </main>
  );
}
