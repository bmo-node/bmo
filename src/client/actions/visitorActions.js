/* Action Types */
export const UPDATE_VISITOR_NAME = 'UPDATE_VISITOR_NAME';

export function updateVisitorName(name = '') {
  return {
    type: UPDATE_VISITOR_NAME,
    name,
  };
}
