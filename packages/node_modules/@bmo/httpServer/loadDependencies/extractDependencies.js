import { parse as parseAst } from 'esprima';
import { parse as parseQuery, match } from 'esquery';
import { get, has } from 'lodash';
export default (fn, dependencyProperty) => {
	const ast = parseAst(fn.toString());
	const root = ast.body[0];
	if (paramParsers[root.type]) {
		const params = paramParsers[root.type](root, dependencyProperty);
		return params;
	} else {
		console.log(`NO PARSER FOR: ${root.type}`);
	}
	return [];
};

const paramParsers = {
	ExpressionStatement: (root, dependencyProperty) => {
		const configParam = root.expression.params[0];
		if (configParam && configParsers[configParam.type]) {
			return configParsers[configParam.type](root, configParam, dependencyProperty);
		}
		return [];
	},
	FunctionDeclaration: (root, dependencyProperty) => {
		const configParam = root.params[0];
		if (configParam && configParsers[configParam.type]) {
			return configParsers[configParam.type](root, configParam, dependencyProperty);
		}
		return [];
	}
};

const configParsers = {
	Identifier: (root, configNode, dependencyProperty) => {
		// find any references to config.dependencies.thing AST
		// from the root down
		const query = parseQuery('[type="MemberExpression"]');
		const expressions = match(root, query);
		return expressions
			.filter((n) => get(n, 'object.object.name') === configNode.name && get(n, 'object.property.name') === dependencyProperty)
			.map((n) => get(n, 'property.name'));
	},
	ObjectPattern: (root, configNode, dependencyProperty) => {
		// find references to destructured ASTs from the root down.
		let deps = [];
		const dependencyNode = configNode.properties.filter(n => n.key.name === dependencyProperty)[0];
		if (dependencyNode) {
			deps = get(dependencyNode, 'value.properties', []).map((n) => n.key.name);
		}
		return deps;
	}
};
