import { each, get, set } from 'lodash';
export default () =>
	(modelMap) =>
		(fromObject) => {
			const value = {};
			each(modelMap, (valueKey, toKey) => {
				set(value, toKey, get(fromObject, valueKey));
			});
			return value;
		};
