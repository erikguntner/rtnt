import React from 'react';
import { render, fireEvent, waitFor } from '../../../utils/test-utils';
import { configStore } from '../../../reducers/store';
import { Provider } from 'react-redux';
import RouteList from '../RouteList';

// const renderRouteList = (props: Partial<{}> = {}, initialState) => {
//   const defaultProps = {};
//   return render(
//     <Provider store={configStore}>
//       <RouteList {...defaultProps} {...props} />
//     </Provider>
//   );
// };

// describe('<RouteList />', () => {
//   test('renders fetched routes in list', async () => {
//     const fake = { token: 'fake_user_token' };
//   });
// });
