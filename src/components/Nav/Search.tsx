export default function Search() {
  return (
    <div>
      <search>
        <form className="text-base text-base-content">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="join">
            <div className="join-item btn rounded-l-full">s</div>
          <input
            id="search"
            type="text"
            placeholder="Search"
            className="input join-item rounded-r-full focus:outline-none focus-visible:outline-none"
          />
          </div>
          
        </form>
      </search>
    </div>
  );
}
