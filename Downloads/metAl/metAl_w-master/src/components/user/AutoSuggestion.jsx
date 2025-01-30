import React, {useEffect, useState} from 'react';
import {getOrganizations} from '../../services/organizations';
import {getBanks} from '../../services/banks';
import {getInsurances} from '../../services/insurances';
import ReactSearchAutocomplete from './Suggestion/ReactSearchAutocomplete';
import './styles.css';
// import { item } from 'joi';

export const BankInput = ({changeHandler, defaultValue}) => {

    const [options, setOptions] = useState(null);
    const [value, setValue] = useState('');

    useEffect(() => {
        
        async function fetchData(){
            const {data} = await getBanks();
    
            let newArr = new Array(data.length);
    
            for (let index = 0; index < data.length; index++) {
                const bank = data[index];
                newArr[index] = {id: index, label: bank.name, name: bank.name}
            }
    
            setOptions(newArr);
        }
        fetchData();
    }, []);

    useEffect(() => {
        console.log(value)
    },[value])

      const formatResult = (item) => {
        return item;
    }
    
    return (
            <ReactSearchAutocomplete
                inputSearchString = {value? value: defaultValue ? defaultValue : ''}
                items = {options? options : [{id: 0, name: "loading"}]}
                onSearch = {item => {setValue(item); changeHandler(item)}}
                onSelect = {item => {setValue(item.name); changeHandler(item.name)}}
                formatResult={formatResult}
                showIcon = {false}
                showClear = {false}
                styling = {
                    {
                        borderRadius: "5px",
                    }
                }
            />
    )
}

export const OrganizationInput = ({changeHandler,defaultValue}) => {
    const [options, setOptions] = useState(null);
    const [value, setValue] = useState('');
    
    useEffect(() => {
        async function fetchData()
        {
            const {data} = await getOrganizations();
            
            let newArr = new Array(data.length);
    
            for (let index = 0; index < data.length; index++) {
                const organization = data[index];
                newArr[index] = {id:index ,label: organization.name, name: organization.name}
            }
    
            setOptions(newArr);
        }

        fetchData();
    }, []);

    const formatResult = (item) => {
        return item;
    }

    return(
        <ReactSearchAutocomplete
                inputSearchString = {value? value: defaultValue ? defaultValue : ''}
                items = {options? options : [{id: 0, name: "loading"}]}
                onSearch = {item => {setValue(item); changeHandler(item)}}
                onSelect = {item => {setValue(item.name); changeHandler(item.name)}}
                formatResult={formatResult}
                showIcon = {false}
                showClear = {false}
                styling = {
                    {
                        borderRadius: "5px",
                    }
                }
            />
    )
}

export const InsuranceInput = ({changeHandler, defaultValue}) => {
    const [options, setOptions] = useState(null);
    const [value, setValue] = useState('');
    
    useEffect(() => {
        async function fetchData()
        {
            const {data} = await getInsurances();
            let newArr = new Array(data.length);
    
            for (let index = 0; index < data.length; index++) {
                const organization = data[index];
                newArr[index] = {id: index, label: organization.name, name: organization.name}
            }
    
            setOptions(newArr);
        }
        fetchData();
    }, []);

    const formatResult = (item) => {
        return item;
    }

    return(
        <ReactSearchAutocomplete
                inputSearchString = {value? value: defaultValue || ''}
                items = {options? options : [{id: 0, name: "loading"}]}
                onSearch = {item => {setValue(item); changeHandler(item)}}
                onSelect = {item => {setValue(item.name); changeHandler(item.name)}}
                formatResult={formatResult}
                showIcon = {false}
                showClear = {false}
                styling = {
                    {
                        borderRadius: "5px",
                    }
                }
            />
    )
}
