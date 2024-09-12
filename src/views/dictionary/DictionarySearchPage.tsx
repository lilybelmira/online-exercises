import { FormEvent, ReactElement, useEffect, useMemo, useState } from "react";
import { HanehldaView } from "../../components/HanehldaView";
import { DefaultNav } from "../../components/HanehldaView/HanehldaNav";
import { Form } from "../signin/common";
import { Card, PhoneticOrthography } from "../../data/cards";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { FindAWordWithQueryPath_Dict } from "../../routing/paths";
import { searchableCards } from "../../data/cards";
import { getPhonetics } from "../../utils/phonetics";
import { PhoneticsPreference } from "../../state/reducers/phoneticsPreference";
import { CardTableDictionary } from "../../components/CardTableDictionary";
import nlp from 'compromise'


const ContentWapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

export interface SearchResult {
  0: number;
  1: number;
  2: number;
  Source: string;
  Source_Long: string;
  Entry: string;
  Syllabary: string;
  Part_of_Speech: string;
  PoS: string;
  Definition: string;
  Definition_Long: string;
  Cross_Reference: string;
  Plural: string;
  Plural_Syllabary: string;
  Verb_1st_Present: string;
  Verb_1st_Present_Syllabary: string;
  Verb_3rd_Past: string;
  Verb_3rd_Past_Syllabary: string;
  Verb_3rd_Present_Habitual: string;
  Verb_3rd_Present_Habitual_Syllabary: string;
  Verb_2nd_Imperative: string;
  Verb_2nd_Imperative_Syllabary: string;
  Verb_3rd_Infinitive: string;
  Verb_3rd_Infinitive_Syllabary: string;
  Sentence_Transliteration: string;
  Sentence_Syllabary: string;
  Sentence_English: string;
  Entry_Tone: string;
  Plural_Tone: string;
  Verb_1st_Present_Tone: string;
  Verb_3rd_Past_Tone: string;
  Verb_3rd_Present_Habitual_Tone: string;
  Verb_2nd_Imperative_Tone: string;
  Verb_3rd_Infinitive_Tone: string;
  Category: string;
  Etymology: string;
  Notes: string;
  MDS_notes: string;
  MDS_syllabary_source: string;
  Index: 1;
  Culturev_Line: null;
  Culturev_Entry: string;
  Culturev_Link: string;
  Verb_Set: string;
  Verb_Root: string;
  CED_Line: null;
  Is_CED_Verb: string;
  Is_Culturev_CED: string;
  Has_Verb_Conj: string;
  Has_Kirk: string;
  FIELD50: string;
  FIELD51: string;
  FIELD52: string;
  FIELD53: string;
  FIELD54: string;
  FIELD55: string;
  FIELD56: string;
  FIELD57: string;
  FIELD58: string;
  FIELD59: string;
}

function searchCards(_query: string) {
  const query = _query.toLocaleLowerCase();
  return getCardsFromResults(searchAll(query));
}

function getCardsFromResults(results:SearchResult[]) {
  var cards = [];
  for (var i = 0; i<results.length; i++) {
    
    const c: Card = { 
      cherokee:results[i].Entry,
      syllabary:results[i].Syllabary,
      english:results[i].Definition,
      alternate_pronunciations: [],
      alternate_syllabary: [],
      cherokee_audio: [],
      english_audio: [],
      phoneticOrthography: PhoneticOrthography.MCO,
    };

    cards.push(c);
  }
  return cards;
}

export function DictionarySearchPage(): ReactElement {
  const { query: pageQuery } = useParams();
  const [query, setQuery] = useState(pageQuery ?? "");

  useEffect(() => {
    if (pageQuery) setQuery(pageQuery);
  }, [pageQuery]);

  const results = useMemo(
    () => (pageQuery ? searchCards(pageQuery) : null),
    [pageQuery]
  );

  const navigate = useNavigate();
  function onFormSubmit(e: FormEvent) {
    e.preventDefault();
    navigate(FindAWordWithQueryPath_Dict(query));
  }
  const resultContent =
    results === null ? (
      <p>...</p>
    ) : results.length === 0 ? (
      <p>No terms found matching your query</p>
    ) : (
      <div>
        <h4>Search results for "{pageQuery}"</h4>
        <CardTableDictionary cards={results} />
      </div>
    );

  return (
    <HanehldaView navControls={<DefaultNav />} collapseNav>
      <ContentWapper>
        <div style={{ padding: "20px 20px 0 20px" }}>
          <span>
            Type below and hit enter to search in Syllabary, Phonetics, and
            English.
          </span>
          <Form onSubmit={onFormSubmit}>
            <input
              type="text"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              placeholder="Phonetics, Syllabary, or English..."
            />
          </Form>
        </div>
        <div>{resultContent}</div>
      </ContentWapper>
    </HanehldaView>
  );
}












const syllables = [...'ᎠᎡᎢᎣᎤᎥᎦᎧᎨᎩᎪᎫᎬᎭᎮᎯᎰᎱᎲᎳᎴᎵᎶᎷᎸᎹᎺᎻᎼᎽᎾᎿᏀᏁᏂᏃᏄᏅᏆᏇᏈᏉᏊᏋᏌᏍᏎᏏᏐᏑᏒᏓᏔᏕᏖᏗᏘᏙᏚᏛᏜᏝᏞᏟᏠᏡᏢᏣᏤᏥᏦᏧᏨᏩᏪᏫᏬᏭᏮᏯᏰᏱᏲᏳᏴᏵ'];

//list of sources and the order they should be presented
const source_weights = {
  banks: 0.971,
  CCCC: 0.95,
  ced: 1.0,
  cn: 0.99,
  cnld: 0.972,
  cnmed: 0.973,
  CNT: 0.965,
  cwl: 0.98,
  fbgp: 0.95,
  hsbc: 0.95,
  KPEP: 0.95,
  magok: 0.95,
  mds: 0.968,
  msct: 0.92,
  ncmed: 0.973,
  noq: 0.969,
  rrd: 0.995,
  sskil: 0.95,
  VRB: 0.985,
};


// Sift4 - simplest version
// online algorithm to compute the distance between two strings in O(n)
// maxOffset is the number of characters to search for matching letters
function sift4(s1, s2, maxOffset) {
  if (!s1 || !s1.length) {
      if (!s2) {
          return 0;
      }
      return s2.length;
  }

  if (!s2 || !s2.length) {
      return s1.length;
  }

  var l1 = s1.length;
  var l2 = s2.length;

  var c1 = 0; //cursor for string 1
  var c2 = 0; //cursor for string 2
  var lcss = 0; //largest common subsequence
  var local_cs = 0; //local common substring
  while ((c1 < l1) && (c2 < l2)) {
      if (s1.charAt(c1) == s2.charAt(c2)) {
          local_cs++;
      } else {
          lcss += local_cs;
          local_cs = 0;
          if (c1 != c2) {
              c1 = c2 = Math.max(c1, c2); //using max to bypass the need for computer transpositions ('ab' vs 'ba')
          }
          for (var i = 0; i < maxOffset && (c1 + i < l1 || c2 + i < l2); i++) {
              if ((c1 + i < l1) && (s1.charAt(c1 + i) == s2.charAt(c2))) {
                  c1 += i;
                  local_cs++;
                  break;
              }
              if ((c2 + i < l2) && (s1.charAt(c1) == s2.charAt(c2 + i))) {
                  c2 += i;
                  local_cs++;
                  break;
              }
          }
      }
      c1++;
      c2++;
  }
  lcss += local_cs;
  var res = Math.round(Math.max(l1, l2) - lcss);

  return 1/(res+1);
}

//use compromise library to get conjugations of word searched in english
function get_word_forms(q) {
  if (q.includes(" "))
    return [q];
  let doc = nlp(q);
  var conj = [q];
  
  if (doc.verbs().conjugate().length > 0) {
    for (var v in doc.verbs().conjugate()[0]) {
      conj.push(doc.verbs().conjugate()[0][v]);
    }
  }
  if (doc.adjectives().conjugate().length > 0) {
    for (var v in doc.adjectives().conjugate()[0]) {
      conj.push(doc.adjectives().conjugate()[0][v]);
    }
  }
  
  doc.tag('Plural');
  doc.nouns().toSingular();
  conj.push(doc.text());
  let doc2 = nlp(q);
  doc2.tag('Singular');
  doc2.nouns().toPlural();
  conj.push(doc2.text());
  
  return conj;
}

//find entries similar to the query
//words = list of queries
//possibilities = dictionary array
//col = name of dictionary collumn being checked
//r = results array to be added to
//cutoff = minimum word similarity
function get_close_matches_indexes(words, possibilities, col, r, cutoff = 0.6) {
  if (!((0.0 <= cutoff) && (cutoff <= 1.0))) {
    throw new Error(`cutoff must be in [0.0, 1.0]: ${cutoff}`);
  }
  var result = [];
  
  var id = 0;
  for (var row of possibilities) {
    for (const w of words) {
      if (row[col].toString().length > 0) {
        const diff = sift4(row[col].toString().trim().toLowerCase(), w.toString().toLowerCase(), 3);
        //console.log([row[col], w, diff]);
        if (diff >= cutoff) {
          if (diff < 0.99)
            result.push([diff*0.5, id]);
          else
            result.push([diff, id]);
        }
      }
    }
    id++;
  }

  var sortedResult = result.sort();
  for (var re of sortedResult) {
    if (r[re[1]] !== undefined) {
      r[re[1]] = Math.max(r[re[1]], re[0]);
    }
    else {
      r[re[1]] = re[0];
    }
  }
  
  return sortedResult;
}

//regex function to check if a word is within an entry, avoiding words within words
function checkWord(word, str) {
  if (word.length > str)
    return false;
  const allowedSeparator = '\\\s,.;"|';

  const regex = new RegExp(
    `(^.*[${allowedSeparator}]${word}$)|(^${word}[${allowedSeparator}].*)|(^${word}$)|(^.*[${allowedSeparator}]${word}[${allowedSeparator}].*$)`,

    // Case insensitive
    'i',
  );
  
  return regex.test(str);
}

//find entries that include the query
//words = list of queries
//possibilities = dictionary array
//col = name of dictionary collumn being checked
//r = results array to be added to
//anyMatch = do you want words within words to count also
function get_contains(words, possibilities, col, r, anyMatch=false) {
  var result = [];
    for (let idx = 0; idx < possibilities.length; idx++) {
    const r = possibilities[idx];
    const x = r[col].toString();
    for (const w of words) {
      let lowerX = x.toString().toLowerCase();
      if (
        checkWord(w,lowerX) ||
        (anyMatch && lowerX.includes(w))
      ) {
        result.push([(w.length / lowerX.length) * 0.04 + 0.6, idx]);
      }
    }
  }

  const sortedResult = result.sort();
  for (const re of sortedResult) {
    
    if (r[re[1]] !== undefined) {
      r[re[1]] = Math.max(r[re[1]], re[0]);
    } else {
      r[re[1]] = re[0];
    }
  }

  return result;
}

//main search algorithm function
//query = cleaned up user input to search box
//lang: 0 = cherokee transliteration, 1 = syllabary, 2 = english, 3 = transliteration or english
//mode = unused holdover from discord bot
//getrow = unused holdover from discord bot
function define(query, lang, mode = 0, GetRow = 0) {
  query = query.toLowerCase();

  const source_col = 0;
  const entry_col = 2;
  const syllabary_col = 3;
  const definition_col = 6;

  var dictionary: any[][] = [];
  dictionary = require('../../data/dict.json');

  var results: { [id: string] : number; } = {};
  const queries = [];
  
  if (lang === 3 || lang === 0) {
    get_close_matches_indexes([query], dictionary, "Entry", results, 0.4);
    get_contains([query], dictionary, "Entry", results);

    //if no results, check within words as well
    if (Object.keys(results).length == 0) {
      get_contains([query], dictionary, "Entry", results, true);
    }
  }

  if (lang === 1) {
    console.log(query);
    get_close_matches_indexes([query], dictionary, "Syllabary", results, 0.4);
    get_contains([query], dictionary, "Syllabary", results);

    //if no results, check within words as well
    if (Object.keys(results).length == 0) {
      get_contains([query], dictionary, "Syllabary", results, true);
    }
  }

  if (lang === 3 || lang === 2) {
    get_close_matches_indexes([query], dictionary, "Definition", results, 0.4);
    queries.push(query);
    var word_forms = get_word_forms(query);

    for (const s of word_forms) {
      queries.push(s);
    }
    get_contains(queries, dictionary, "Definition", results);
  }

  const rows = [];
  for (const r in results) {
    results[r] *= source_weights[dictionary[r]["Source"]];
  }

  const sortedResults = Object.entries(results)
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0]);

  var row = 0;
  for (const r of sortedResults) {
    rows.push(dictionary[r]);
    rows[row]["Accuracy"] = results[r].toFixed(2);
    row+=1;
  }

  const table = [];
  //console.log(sortedResults);
  for (let i = 0; i < Math.min(rows.length, 50); i++) {
    table.push(
      rows[i]
    );
  }
  
  let response = [];
  if (mode === 1) {
    response = rows[GetRow];
  } else if (mode === 0) {
    if (table.length === 0) {
      response = [];
    } else {
      response = table;
    }
  } else if (mode === 2) {
    const startIndex = GetRow * 10;
    for (
      let i = startIndex;
      i < Math.min(rows.length, startIndex + 10);
      i++
    ) {
      table.push(
        rows[i]
      );
    }
    if (table.length === 0) {
      response = [];
    } else {
      response = table;
    }
  }

  const firstX = response.slice(0, 25);
  console.log(firstX);
  return firstX;
}

//function called to search a query in cherokee (unused)
function definex(message) {
  const query = message.trim();
  if (syllables.some((elem) => query.toUpperCase().includes(elem))) {
    return define(query, 1);
  } else {
    return define(query, 0);
  }
} 

//function called to search a query in english (unused)
function searchx(message) {
  const query = message.trim();
  return define(query, 2);
  //console.log(response);
}

//function called to search any query
function searchAll(message) {
  const query = message;
  
  if (syllables.some((elem) => query.toUpperCase().includes(elem))) {
    return define(query, 1);
  } else {
    return define(query, 3);
  }
}