import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Components
import App from '../components/App/App';

// Actions
import { updateVisitorName } from '../actions/visitorActions';

function mapStateToProps(state) {
  return {
    visitorName: state.visitor.name,
  };
}

const mapDispatchToProps = dispatch => ({
  updateName: bindActionCreators(updateVisitorName, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
