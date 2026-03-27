import { Routes } from '@angular/router';
import {Layout} from '../pages/layout/layout';
import {Preview} from '../pages/preview/preview';
import {canActivateAuth} from '../entities/auth/guards/access.guard';
import {Login} from '../pages/auth/login/login';
import {Register} from '../pages/auth/register/register';
import {HomePage} from '../pages/home-page/home-page';
import {TopicPage} from '../pages/topic-page/topic-page';
import {AuthorPage} from '../pages/author-page/author-page';
import {MePage} from '../pages/me-page/me-page';
import {EditorMenu} from '../pages/editor-menu/editor-menu';
import {EditorTopicPage} from '../pages/editor-page/editor-topic-page';
import {EditProfilePage} from '../pages/edit-profile-page/edit-profile-page';
import {AuthorsTopPage} from '../pages/authors-top-page/authors-top-page';

export const routes: Routes = [
  { path: 'preview', component: Preview },
  { path: '', component: Layout, children:
    [
      { path: '', component: HomePage },
      { path: 'author-rating', component: AuthorsTopPage },
      { path: 'topic/:id', component: TopicPage },
      { path: 'author/:id', component: AuthorPage },
      { path: 'editor', component: EditorMenu },
      { path: 'new-topic', component: EditorTopicPage },
      { path: 'new-event', component: EditorTopicPage },
      { path: 'edit-topic/:id', component: EditorTopicPage },
      { path: 'edit-event/:id', component: EditorTopicPage },
      { path: 'me', component: MePage },
      { path: 'edit-profile', component: EditProfilePage },
    ],
    canActivate: [canActivateAuth]
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register }
];
