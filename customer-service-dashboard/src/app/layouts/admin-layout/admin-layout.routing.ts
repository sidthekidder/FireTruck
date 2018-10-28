import { Routes } from '@angular/router';

import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'create-issue',   component: UserProfileComponent },
    { path: 'issue-list',     component: TableListComponent },
    { path: 'create-solution',     component: TypographyComponent },
    { path: 'show-unresolved',          component: IconsComponent }
];
