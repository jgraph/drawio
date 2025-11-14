//
//  ContentView.swift
//  DrawIO
//
//  Created on 2025-11-14.
//

import SwiftUI

struct ContentView: View {
    @State private var showingMenu = false
    @State private var isLoading = true

    var body: some View {
        NavigationView {
            ZStack {
                DiagramWebView(isLoading: $isLoading)
                    .edgesIgnoringSafeArea(.all)

                if isLoading {
                    ProgressView("Loading Draw.io...")
                        .padding()
                        .background(Color(UIColor.systemBackground).opacity(0.9))
                        .cornerRadius(10)
                }
            }
            .navigationTitle("Draw.io")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        showingMenu.toggle()
                    }) {
                        Image(systemName: "ellipsis.circle")
                    }
                }
            }
            .actionSheet(isPresented: $showingMenu) {
                ActionSheet(
                    title: Text("Draw.io"),
                    message: Text("Diagramming made simple"),
                    buttons: [
                        .default(Text("About")) {
                            // Open about page
                        },
                        .default(Text("Help")) {
                            // Open help page
                        },
                        .cancel()
                    ]
                )
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
