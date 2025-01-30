import React from "react";
import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
} from "react-sortable-hoc";

function arrayMove(array, from, to) {
  array = array.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
  return array;
}

const SortableMultiValue = SortableElement((props) => {
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const innerProps = { ...props.innerProps, onMouseDown };
  return <components.MultiValue {...props} innerProps={innerProps} />;
});

const SortableMultiValueLabel = sortableHandle((props) => (
  <components.MultiValueLabel {...props} />
));

const SortableSelect = SortableContainer(Select);

const LanguageDropDown = ({changeHandler}) => {
  const [selected, setSelected] = useState([]);

  const options = [
    { value: "English", label: "English" },
    { value: "普通话", label: "普通话" },
    { value: "Español", label: "Español" },
    { value: "日本語", label: "日本語" },
    { value: "हिन्दी", label: "हिन्दी" },
    { value: "Deutsch", label: "Deutsch" },
    { value: "اَلْعَرَبِيَّةُ", label: "اَلْعَرَبِيَّةُ" },
    { value: "Français", label: "Français" },
    { value: "Italiano", label: "Italiano" },
    { value: "한국어", label: "한국어" },
    { value: "Tiếng Việt", label: "Tiếng Việt" },
    { value: "русский язык", label: "русский язык" },
    { value: "Português", label: "Português" },
    { value: "Türkçe", label: "Türkçe" },
  ];

  const onChange = (selectedOptions) => {setSelected(selectedOptions); changeHandler(selectedOptions)};

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newValue = arrayMove(selected, oldIndex, newIndex);
    setSelected(newValue);
    console.log(
      "Values sorted:",
      newValue.map((i) => i.value)
    );
  };

  const customStyles = {
    container: (styles) => ({
        ...styles,
        width:"100%", 
        maxWidth:"450px"
      }),
      menuPortal: provided => ({ ...provided, zIndex: 9999 }),
      menu: provided => ({ ...provided, zIndex: 9999 }),
  }

  return (
      <SortableSelect
        styles={customStyles}
        useDragHandle
        axis="xy"
        onSortEnd={onSortEnd}
        distance={4}
        getHelperDimensions={({ node }) => node.getBoundingClientRect()}
        isMulti
        options={options}
        value={selected}
        onChange={onChange}
        components={{
          MultiValue: SortableMultiValue,
          MultiValueLabel: SortableMultiValueLabel,
        }}
        menuPortalTarget={document.body}
        menuPosition={'fixed'} 
        closeMenuOnSelect={false}
        isSearchable={false}
      />
  );
};

export default LanguageDropDown;
