import {
  getMatchingIndex,
  IUseAutoCompleteData,
  useAutoComplete,
  useDebounce
} from '../hooks';
import './CountryInput.css';

interface ICountry {
  data: {
    countries: {
      edges: [
        {
          node: {
            name: string,
            flag: string,
          }
        }
      ],
    }
  },
}

const fetchCountries = async (name: string): Promise<IUseAutoCompleteData[]> => {
  const url = 'https://graphql.country/graphql';
  const query = `
    {
      countries(name_Icontains: "${name}") {
        edges {
          node {
            name,
            flag,
          }
        }
      }
    }
  `
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({
      query: query,
    }),
  });

  const json: ICountry =  await response.json();

  return json.data.countries.edges.map(({ node }) => {
    return {
      name: node.name,
      icon: node.flag,
    }
  });
}

const CountryInput = () => {
  const debouncedFetch = useDebounce(fetchCountries, 300);
  const {
    search,
    results,
    onSearchChange,
    onSelectItem
  } = useAutoComplete({ fetch: debouncedFetch })

  return (
    <div className="Country-container">
      <div className="Country-input-container">
        <input
          type="text"
          id="country"
          name="name"
          value={search}
          placeholder="Select a country"
          onChange={(ev) => onSearchChange(ev.target.value)}
        />
        <span onClick={() => onSearchChange('')}>❌</span>
      </div>
      {
        Boolean(results.length) && (
          <div className="Country-results">
            {
              results.map(country => {
                const { start, end } = getMatchingIndex(country.name, search);
                const { name } = country;

                return (
                  <div
                    key={name}
                    className="Country-results-item"
                    onClick={() => onSelectItem(name)}
                  >
                    <img
                      alt="country flag"
                      width={24}
                      height={18}
                      src={country.icon}
                    />
                    {
                      Boolean(start >= 0) ? (
                        <span>
                          <span>{name.slice(0, start)}</span>
                          <span><b>{name.slice(start, end)}</b></span>
                          <span>{name.slice(end)}</span>
                        </span>
                      ) : (
                        <span>{name}</span>
                      )
                    }
                  </div>
                )
              })
            }
          </div>
        )
      }
    </div>
  )
}

export default CountryInput;
