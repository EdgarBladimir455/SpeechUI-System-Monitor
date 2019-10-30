import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HoldableDirective } from './directives/holdable.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadModule } from 'ng2-file-upload';
import { AppRoutingModule } from './app.routes.module';
import { LayoutComponent } from './layout/layout.component';
import { MenuComponent } from './menu/menu.component';
import { SharedModule } from './shared/shared.module';
import { RecordComponent } from './record/record.component';
import { StoreModule } from '@ngrx/store';
import { contextReducer, navReducer, actionReducer } from './ngrx/command/command.reducers';
import { AudioRecordingService } from './services/audio-recording.service';

@NgModule({
  declarations: [
    AppComponent,
    HoldableDirective,
    LayoutComponent,
    MenuComponent,

    RecordComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FileUploadModule,
    AppRoutingModule,
    SharedModule,
    StoreModule.forRoot({ routeReducer: navReducer,
                          contextReducer: contextReducer,
                          actionReducer: actionReducer 
                        })
  ],
  providers: [AudioRecordingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
