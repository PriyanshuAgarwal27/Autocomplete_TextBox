import React, { useEffect, useState } from "react";
import "./TextBox.css";
import axios from "axios";

const Textbox = () => {
  const [inputValue, setInputValue] = useState("");
  const [list, setList] = useState([]);
  const [debounceValue, setDebounceValue] = useState("");
  const [cache, setCache] = useState({});

  useEffect(() => {
    const handlr = setTimeout(() => {
      setDebounceValue(inputValue);
    }, [300]);
    return () => {
      clearTimeout(handlr);
    };
  });

  useEffect(() => {
    if (debounceValue) {
      fetchData(debounceValue);
    } else {
      setList([]);
    }
  }, [debounceValue]);
  const onCancelSearchEvent = () => {
    setInputValue("");
  };
  const getHighlightItem = (item) => {
    const splitItem = item.split(new RegExp(`(${inputValue})`, "gi"));
    return (
      <span>
        {splitItem.map((part, index) => {
          return part.toLowerCase() === inputValue.toLowerCase() ? (
            <b key={index}>{part}</b>
          ) : (
            part
          );
        })}
      </span>
    );
  };
  const fetchData = async (inputValue) => {
    if (cache[inputValue]) {
      setList(cache[inputValue]);
      return;
    } else if (inputValue) {
      const response = await axios.get(`https://en.wikipedia.org/w/api.php`, {
        params: {
          action: "opensearch",
          search: inputValue,
          format: "json",
          origin: "*",
        },
      });
      const newCache = { ...cache, [inputValue]: response.data[1] };
      setCache(newCache);
      setList(response.data[1]);
    } else {
      setList([]);
    }
  };
  return (
    <div>
      <div className="search-input-container">
        <input
          className="input-search"
          type="text"
          placeholder="Search"
          id="search"
          value={inputValue}
          autoFocus={true}
          name="search"
          onChange={(e) => setInputValue(e.target.value)}
        />
        {inputValue && (
          <button className="cancel-search-input" onClick={onCancelSearchEvent}>
            ❌
          </button>
        )}
      </div>
      {list.length > 0 && (
        <div className="search-list">
          {list.map((item, index) => (
            <div key={index}>
              {item.toLowerCase().includes(inputValue.toLowerCase())
                ? getHighlightItem(item)
                : item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Textbox;
