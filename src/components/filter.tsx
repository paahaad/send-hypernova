"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Filter } from "lucide-react";

const categories = [
  "Hot",
  "AI",
  "Trending",
  "New",
  "Top Gainers",
  "Top Losers",
  "Other",
];

const FilterComponent = ({ onFilterChange }: any) => {
  const [activeCategory, setActiveCategory] = useState("Hot");

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // onFilterChange(category);
  };

  return (
    <Card className="p-2 flex space-x-3 text-white items-center rounded-lg shadow-lg">
      <Filter className="text-gray-400 w-6 h-6" />
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "ghost"}
          className={`px-4 py-2 rounded-md transition-all duration-300 ${
            activeCategory === category
              ? "bg-blue-600 text-white shadow-md"
              : "bg-[#1e293b] text-gray-300 hover:bg-[#334155]"
          }`}
          onClick={() => handleCategoryChange(category)}
        >
          {category}
        </Button>
      ))}
    </Card>
  );
};

export default FilterComponent;
