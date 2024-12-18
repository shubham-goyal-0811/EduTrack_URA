import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Dictionary = () => {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [error, setError] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [audio, setAudio] = useState("");

  const fetchWord = async () => {
    if (!word) {
      setError("Please enter a word");
      return;
    }
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (response.ok) {
        const data = await response.json();
        const wordData = data[0];
        const definitions = wordData.meanings[0]?.definitions;

        if (definitions?.length > 0) {
          setDefinition(definitions.slice(0, 3));
          setPhonetic(wordData.phonetic);
          setAudio(wordData.phonetics.find((p) => p.audio)?.audio || "");
          setError("");
        } else {
          setError("Definitions not found.");
          clearResults();
        }
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      setError("Word not found. Please try again.");
      clearResults();
    }
  };

  const clearResults = () => {
    setDefinition("");
    setPhonetic("");
    setAudio("");
  };

  return (
    <div className="p-4">
      <div className="flex items-center space-x-2 mb-6">
        <input
          type="text"
          placeholder="Enter a word..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={fetchWord}
          className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {(definition || phonetic || audio) && (
        <div className="space-y-4">
          {phonetic && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{phonetic}</span>
              {audio && (
                <audio controls className="h-8">
                  <source src={audio} />
                </audio>
              )}
            </div>
          )}

          {definition && (
            <div className="space-y-3">
              {definition.map((def, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-800 mb-2">{def.definition}</p>
                  {def.example && (
                    <p className="text-gray-600 text-sm italic">
                      Example: {def.example}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dictionary;
