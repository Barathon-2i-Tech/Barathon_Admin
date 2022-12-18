import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import TagIcon from '@mui/icons-material/Tag';
import EmailIcon from '@mui/icons-material/Email';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';


export const mainListItems = (
    <React.Fragment>
        <ListItemButton href="/admin/dashboard" >
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton href="/admin/utilisateurs">
            <ListItemIcon>
                <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Utilisateurs" />
        </ListItemButton>
        <ListItemButton href="/admin/etablissements">
            <ListItemIcon>
                <HomeWorkIcon />
            </ListItemIcon>
            <ListItemText primary="Etablissements" />
        </ListItemButton>
        <ListItemButton href="/admin/evenements">
            <ListItemIcon>
                <ConfirmationNumberIcon />
            </ListItemIcon>
            <ListItemText primary="Evenements" />
        </ListItemButton>
        <ListItemButton href="/admin/tags">
            <ListItemIcon>
                <TagIcon />
            </ListItemIcon>
            <ListItemText primary="Tags" />
        </ListItemButton>
        <Divider sx={{ my: 1 }} />
        <ListItemButton href="/admin/messagerie">
            <ListItemIcon>
                <EmailIcon />
            </ListItemIcon>
            <ListItemText primary="Messagerie" />
        </ListItemButton>
        <ListItemButton href="/admin/profile">
            <ListItemIcon>
                <PermContactCalendarIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
        </ListItemButton>

    </React.Fragment>
);
