use std::sync::{Arc,atomic::{AtomicU64,Ordering}};
use tauri::{AppHandle,Manager,PhysicalPosition,PhysicalSize,State};

#[derive(Default)]
struct Motion { generation:Arc<AtomicU64> }

#[tauri::command]
async fn chase_ball(app:AppHandle,motion:State<'_,Motion>,target_x:f64,target_y:f64)->Result<(),String>{
 let window=app.get_webview_window("pet").ok_or("Pet window not found")?;
 let pos=window.outer_position().map_err(|e|e.to_string())?;
 let size=window.outer_size().map_err(|e|e.to_string())?;
 // Approach from the current side; stop next to the ball, not on top of it.
 let current_center=pos.x as f64+size.width as f64/2.0;
 let offset=if target_x<current_center {size.width as f64*0.23} else {-(size.width as f64)*0.23};
 let target_x=(target_x+offset-size.width as f64/2.0) as i32;
 let target_y=(target_y-size.height as f64*0.72) as i32;
 let generation=motion.generation.clone();
 let id=generation.fetch_add(1,Ordering::SeqCst)+1;
 tauri::async_runtime::spawn_blocking(move||{
  let dx=target_x-pos.x;let dy=target_y-pos.y;
  let dist=((dx as f64).powi(2)+(dy as f64).powi(2)).sqrt();
  let steps=((dist/4.0).ceil() as usize).clamp(1,350);
  for i in 1..=steps {
   if generation.load(Ordering::SeqCst)!=id{return Ok(())}
   let t=i as f64/steps as f64;
   let e=t; // constant-speed travel synchronized to visible leg-step frames
   window.set_position(PhysicalPosition::new(pos.x+(dx as f64*e) as i32,pos.y+(dy as f64*e) as i32)).map_err(|e|e.to_string())?;
   std::thread::sleep(std::time::Duration::from_millis(16));
  }
  Ok::<(),String>(())
 }).await.map_err(|e|e.to_string())?
}
#[tauri::command]
fn show_pet(app:AppHandle)->Result<(),String>{app.get_webview_window("pet").ok_or("Pet not found")?.show().map_err(|e|e.to_string())}
#[tauri::command]
fn hide_pet(app:AppHandle)->Result<(),String>{app.get_webview_window("pet").ok_or("Pet not found")?.hide().map_err(|e|e.to_string())}
#[tauri::command]
fn show_ball(app:AppHandle)->Result<(),String>{
 let w=app.get_webview_window("ball").ok_or("Ball not found")?;
 w.show().map_err(|e|e.to_string())?;
 // The transparent pet window still captures mouse input in its rectangular
 // bounds on Windows. Keep the draggable ball ABOVE the pet window.
 w.set_always_on_top(false).map_err(|e|e.to_string())?;
 w.set_always_on_top(true).map_err(|e|e.to_string())
}
#[tauri::command]
fn hide_ball(app:AppHandle)->Result<(),String>{app.get_webview_window("ball").ok_or("Ball not found")?.hide().map_err(|e|e.to_string())}
#[tauri::command]
fn set_fullscreen_click_through(app:AppHandle,enabled:bool)->Result<(),String>{
 // Tauri delegates this to the native windowing backend. While enabled,
 // both transparent overlays ignore pointer input so clicks reach the game.
 for label in ["pet","ball"] {
  let window=app.get_webview_window(label).ok_or(format!("{label} not found"))?;
  window.set_ignore_cursor_events(enabled).map_err(|e|e.to_string())?;
 }
 Ok(())
}
#[tauri::command]
fn resize_pet(app:AppHandle,size_percent:u32)->Result<(),String>{
 let w=app.get_webview_window("pet").ok_or("Pet not found")?;
 let factor=(size_percent as f64/90.0).clamp(0.65,1.3);
 let width=(250.0*factor) as u32;let height=(230.0*factor) as u32;
 let old=w.outer_size().map_err(|e|e.to_string())?;let pos=w.outer_position().map_err(|e|e.to_string())?;
 w.set_size(PhysicalSize::new(width,height)).map_err(|e|e.to_string())?;
 w.set_position(PhysicalPosition::new(pos.x+(old.width as i32-width as i32)/2,pos.y+(old.height as i32-height as i32)/2)).map_err(|e|e.to_string())
}
#[tauri::command]
fn resize_ball(app:AppHandle,size_percent:u32)->Result<(),String>{
 let w=app.get_webview_window("ball").ok_or("Ball not found")?;
 // Both pet and yarn scale from the same user-selected size percentage.
 let factor=(size_percent as f64/90.0).clamp(0.65,1.3);
 let width=(90.0*factor).round() as u32;
 let height=width;
 let old=w.outer_size().map_err(|e|e.to_string())?;
 let pos=w.outer_position().map_err(|e|e.to_string())?;
 w.set_size(PhysicalSize::new(width,height)).map_err(|e|e.to_string())?;
 w.set_position(PhysicalPosition::new(
   pos.x+(old.width as i32-width as i32)/2,
   pos.y+(old.height as i32-height as i32)/2
 )).map_err(|e|e.to_string())
}
#[tauri::command]
fn move_pet_to_spot(app:AppHandle,spot:usize)->Result<(),String>{
 let w=app.get_webview_window("pet").ok_or("Pet not found")?;
 let mon=w.current_monitor().map_err(|e|e.to_string())?.or_else(||w.primary_monitor().ok().flatten()).ok_or("No monitor found")?;
 let m=mon.position();let bounds=mon.size();let size=w.outer_size().map_err(|e|e.to_string())?;
 let x=if spot%2==0{m.x+24}else{m.x+bounds.width as i32-size.width as i32-24};
 let y=if spot<2{m.y+45}else{m.y+bounds.height as i32-size.height as i32-65};
 w.set_position(PhysicalPosition::new(x,y)).map_err(|e|e.to_string())?;
 w.show().map_err(|e|e.to_string())
}
pub fn run(){
 tauri::Builder::default().manage(Motion::default())
 .invoke_handler(tauri::generate_handler![chase_ball,show_pet,hide_pet,show_ball,hide_ball,set_fullscreen_click_through,resize_pet,resize_ball,move_pet_to_spot])
 .setup(|app|{
  for label in ["dashboard","pet","ball"]{
   if let Some(w)=app.get_webview_window(label){
    let overlay=label!="dashboard";
    let _=w.set_always_on_top(overlay);
    let _=w.set_skip_taskbar(overlay);
    #[cfg(target_os="macos")]
    if overlay {let _=w.set_visible_on_all_workspaces(true);}
   }
  }
  // Both overlays are topmost: make sure the ball is the upper one.
  if let Some(ball)=app.get_webview_window("ball"){
    let _=ball.set_always_on_top(false);
    let _=ball.set_always_on_top(true);
  }
  Ok(())
 })
 .run(tauri::generate_context!()).expect("error while running Desktop Cat");
}
