import { useNavigate, useLocation } from 'react-router-dom';
import {
  Masthead,
  MastheadMain,
  MastheadLogo,
  MastheadBrand,
  MastheadContent,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  Content,
  ContentVariants
} from '@patternfly/react-core';
import './AppNav.scss';

export const AppNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === '/';
  const isTodoList = location.pathname === '/todos';

  return (
    <Masthead className="app-nav">
      <MastheadMain>
        <MastheadBrand>
          <MastheadLogo>
            <Content>
              <Content component={ContentVariants.h1} className="app-nav__title">
                TODO Application
              </Content>
            </Content>
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar id="app-nav-toolbar">
          <ToolbarContent>
            <ToolbarItem>
              <Button
                variant={isDashboard ? 'primary' : 'secondary'}
                onClick={() => navigate('/')}
              >
                Dashboard
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button
                variant={isTodoList ? 'primary' : 'secondary'}
                onClick={() => navigate('/todos')}
              >
                TODO List
              </Button>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );
};
