import { Routes } from '@angular/router';
import {Layout} from '../pages/layout/layout';
import {Preview} from '../pages/preview/preview';
import {canActivateAuth} from '../entities/auth/guards/access.guard';
import {redirectToOwnProfile} from '../entities/auth/guards/me.guard';
import {Login} from '../pages/auth/login/login';
import {Register} from '../pages/auth/register/register';
import {HomePage} from '../pages/home-page/home-page';
import {TopicPage} from '../pages/topic-page/topic-page';
import {AuthorPage} from '../pages/author-page/author-page';
import {EditorPage} from '../pages/editor-page/editor-page';
import {MePage} from '../pages/me-page/me-page';
import {EditorMenu} from '../pages/editor-menu/editor-menu';

export const routes: Routes = [
  { path: 'preview', component: Preview },
  { path: '', component: Layout, children:
    [
      { path: '', component: HomePage },
      { path: 'topic/:id', component: TopicPage },
      { path: 'author/:id', component: AuthorPage },
      { path: 'editor', component: EditorMenu },
      { path: 'new-topic', component: EditorPage },
      { path: 'new-event', component: EditorPage },
      { path: 'edit/:id', component: EditorPage },
      { path: 'me', component: MePage },
    ],
    canActivate: [canActivateAuth]
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register }
];
