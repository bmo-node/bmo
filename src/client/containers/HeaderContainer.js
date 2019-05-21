import { connect } from 'react-redux';

// Components
import Header from '../components/Header/Header';

function mapStateToProps(state) {
  return {
    visitorName: state.visitor.name,
  };
}

export default connect(mapStateToProps)(Header);
