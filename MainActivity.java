package io.ionic.starter;

import android.os.Bundle;

import com.byteowls.capacitor.filesharer.FileSharerPlugin;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    List<Class<? extends Plugin>> additionalPlugins = new ArrayList<>();
    // Additional plugins you've installed go
    // here
    // Ex: additionalPlugins.add(TotallyAwesomePlugin.class);
    additionalPlugins.add(FileSharerPlugin.class);

    // Initializes the Bridge
    this.init(savedInstanceState, additionalPlugins);
  }
}
