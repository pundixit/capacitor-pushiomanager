require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'OracleCapacitorPushiomanager'
  s.version = package['version']
  s.summary = package['description']
  s.license = package['license']
  s.homepage = package['repository']['url']
  s.author = package['author']
  s.source = { :git => package['repository']['url'], :tag => s.version.to_s }
  s.source_files = 'ios/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
  s.requires_arc = true
  s.ios.deployment_target  = '13.0'
  s.dependency 'Capacitor'
  s.swift_version = '5.1'
  s.vendored_frameworks = 'ios/frameworks/PushIOManager.xcframework'
  s.preserve_paths = "ios/frameworks/PushIOManager.xcframework" 
  s.pod_target_xcconfig = { 'OTHER_LDFLAGS' => '-ObjC' }
  s.libraries      = 'sqlite3'
  s.frameworks     = 'UserNotifications', 'CoreLocation', 'Foundation', 'UIKit'
  s.ios.frameworks = 'WebKit'
end
