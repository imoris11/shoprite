import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import '../../Resources/css/header.css';
import { Link } from 'react-router-dom';

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuItems:{
    margin:10,
    padding:5
  },
});

class PrimarySearchAppBar extends React.Component {
  constructor () {
    super()
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
      departments:[],
      token:'',
      searchString:''
    }
    this.departments = []
  }
  componentDidMount () {
    this.fetchData()
    this.confirmUserStatus()
  }

  fetchData = () => {
    fetch("https://backendapi.turing.com/departments").then(response => response.json()).then(results => {
      if (!results.error) {
        this.setState({departments:results})
      }
    })
  }

  async confirmUserStatus () {
    let token = await localStorage.getItem('token');
    if (token) {
      this.setState({token, loggedIn:true})
    }
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  logout = () => {
    this.handleMobileMenuClose();
    localStorage.clear();
    window.location.href="/";
  }

  searchProducts = (e) =>  {
    e.preventDefault();
    //Temporary fix. Redirect from react-router-dom crashes
    window.location.href="/search/"+this.state.searchString;
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name] :e.target.value
    })
  }
  render() {
    let {departments} = this.state;
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <Link to='/profile'>
          <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
        </Link>
        <MenuItem onClick={this.logout}>Log Out</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMenuClose}
      >
        {departments.map((department, key)=>
          <Link key={key} to={"/catalogue/" + department.department_id + "/" +department.name}>
            <MenuItem onClick={this.handleMobileMenuClose}>
              <Typography variant="h6" color="inherit" className={classes.menuItems}>
                {department.name}
              </Typography>
            </MenuItem>
          </Link>
        )}
      </Menu>
    );

    return (
      <div className={classes.root}>
        <AppBar position="static" style={{backgroundColor:'#f62f5e'}}>
          <Toolbar>
            <Link className='navbar-brand' to='/'>
              <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                SHOPMATE
              </Typography>
            </Link>

            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              {departments.map((department, key)=>
                <Link key={key} to={"/catalogue/" + department.department_id + "/" +department.name}>
                  <Typography variant="h6" color="inherit" className={classes.menuItems + " secondary-link"}>
                    {department.name}
                  </Typography>
                </Link>
              )}
            </div>
            <div className={classes.grow} />
            <form onSubmit={this.searchProducts}>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  onChange={this.handleChange}
                  id={'searchBox'}
                  name='searchString'
                  value={this.state.searchString}
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                />
              </div>
              <button id="submitBtn" type="submit" style={{display:'none'}}></button>
            </form>
            <div>
              {this.state.loggedIn && (
            <div>
              <IconButton
                aria-owns={isMenuOpen ? 'menu-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
          )}
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <MenuIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </div>
    );
  }
}

PrimarySearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PrimarySearchAppBar);
