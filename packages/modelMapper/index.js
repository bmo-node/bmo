import { each, get, set, isFunction } from 'lodash';
export default () =>
	(modelMap) =>
		(fromObject) => {
			const value = {};
			each(modelMap, (valueKey, toKey) => {
				let newValue;
				if (isFunction(valueKey)) {
					newValue = valueKey(fromObject);
				} else {
					newValue = get(fromObject, valueKey);
				}
				set(value, toKey, newValue);
			});
			return value;
		};
