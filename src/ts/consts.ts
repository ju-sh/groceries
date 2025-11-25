// Time when data.json was last modified 
const validFrom = 1764040174950

// Path to input json file with the data
const jsonPath = "data/data.json";

// Type corresponding to interface of data.json
interface FileData {
    category: string;
    items: string[];
}

export { validFrom, jsonPath, FileData };


