import ExtendableError from 'extendable-error';
class Unauthorized extends ExtendableError {}
class Validation extends ExtendableError {}
class Unauthenticated extends ExtendableError {}
export default () => ({
	Unauthorized,
	Unauthenticated,
	Validation
});
