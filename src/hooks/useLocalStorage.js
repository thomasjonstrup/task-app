import React, { useState, useEffect } from 'react';

const useLocalStorage = localStorageKey => {
	const [value, setValue] = useState(
		localStorage.getItem(localStorageKey) || ''
	);

	useEffect(() => {
		localStorage.setItem(localStorageKey, value);
	}, [value]);

	return [value, setValue];
};

export default useLocalStorage;
