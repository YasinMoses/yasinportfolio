import React from 'react';
import {useState, useEffect} from 'react';
import http from '../../services/httpService';
import Select from 'react-select';


const apiUrl = process.env.REACT_APP_API_URL;

const CountryDropDown = ({ selectedValue,changeHandler,...props}) => {

    const URL = `${apiUrl}/countriesd`;

    const [countries, setCountries] = useState(null);
    const [value, setValue] = useState(null);
   
    useEffect(()=> {
      async function fetchData()
      {
        // const agent = new https.Agent({  
        //   rejectUnauthorized: false
        // });
        //const {data} = await http.get(URL, { httpsAgent: agent });
        const {data} = await http.get(URL);
        let arr = new Array(data.length);
        for (let index = 0; index < data.length; index++) {
            const country = data[index];
            arr[index] = {
                value: country.name,
                label: country.name,
                flag: country.flag,
            }
        }
        setCountries(arr);
      }

      fetchData();
    },[]);

      const formatOptionLabel = ({ value, label, flag }) => (
        <div style={{ 
            display: "flex",
            alignItems: 'center'
            }}>
          <img src={flag} style={{width:'20px', height:'12px', marginRight: "20px"}} />
          <div>{label}</div>
        </div>
      );

      const displayItem = (selected) => {
        if(!countries) return { value: "", label: "" };
        
        const item = countries.find((x) => x.value === selected);
        return item ? item : { value: "", label: "" };
      };

      const customStyles = (value) => ({
        menuPortal: provided => ({ ...provided, zIndex: 9999 }),
        menu: provided => ({ ...provided, zIndex: 9999 }),
      })

    return (
        <Select
            styles={customStyles}
            menuPortalTarget={document.body}
            menuPosition={'fixed'} 
            onChange={item => {setValue(item); changeHandler(item.label)}}
            formatOptionLabel={formatOptionLabel}
            options={countries? countries: {value: 'loading', label: 'loading'}}
            value={displayItem(selectedValue)}
            defaultValue={displayItem(selectedValue)}
        />
    )
}

export default CountryDropDown;