import { SearchIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div>
      <search>
        <form onSubmit={handleSearch} className="text-base text-base-content">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="join">
            <button
              onClick={handleSearch}
              className="btn join-item rounded-l-full"
            >
              <SearchIcon size={20} />
            </button>
            <input
              id="search"
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input join-item rounded-r-full focus:outline-none focus-visible:outline-none"
            />
          </div>
        </form>
      </search>
    </div>
  );
}
