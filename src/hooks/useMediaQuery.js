import { useEffect, useState } from "react";
function useMediaQuery(query) {
  console.log('useMediaQuery', query)
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const matchQueryList = window.matchMedia(query);
    console.log(matchQueryList)
    setMatches(matchQueryList.matches);
    function handleChange(e) {
      console.log('handleChange')
      setMatches(e.matches);
    }
    matchQueryList.addEventListener("change", handleChange);
    return () => {
      matchQueryList.removeEventListener("change", handleChange);
    };
  }, [query]);
  return matches;
}

export default useMediaQuery;