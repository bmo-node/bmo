import { each, get, set, isFunction } from 'lodash';
export default () =>
	(modelMap) =>
		(fromObject) => {
			const value = {};
			each(modelMap, (valueKey, toKey) => {
				let newValue = get(fromObject, valueKey);
				if (isFunction(newValue)) {
					newValue = newValue(fromObject);
				}
				set(value, toKey, newValue);
			});
			return value;
		};
