import { NotFound404Component } from './not-found404.component';

import { WebrtcVideo } from './features/webrtcvideo';
import { WebrtcSnapshot } from './features/webrtcsnapshot';
// import { WebrtcRecord } from './features/webrtcrecord';
import { WebrtcCaller } from './features/webrtccaller';
import { WebrtcReceiver } from './features/webrtcreceiver';


import { VideoComponent } from './features/video/video.component';
import { SnapshotComponent } from './features/snapshot/snapshot.component';
// import { RecorderComponent } from './features/recorder/recorder.component';
import { RtcpeerComponent } from './features/rtcpeer/rtcpeer.component';
import { CallerComponent } from './features/caller/caller.component';
import { ReceiverComponent } from './features/receiver/receiver.component';
import { PresenterComponent } from './features/presenter/presenter.component';

export const APP_DECLERATIONS = [
  NotFound404Component,

  // Components with logic
  WebrtcVideo,
  WebrtcSnapshot,
  // WebrtcRecord,
  WebrtcCaller,
  WebrtcReceiver,
  PresenterComponent,

  // Components to display
  VideoComponent,
  SnapshotComponent,
  // RecorderComponent,
  RtcpeerComponent,
  CallerComponent,
  ReceiverComponent
];
