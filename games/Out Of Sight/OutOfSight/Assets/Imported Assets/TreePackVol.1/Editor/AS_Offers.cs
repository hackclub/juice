// ALIyerEdon@gmail.com - Writed at July 2021
// All rights reserved

using UnityEditor;
using UnityEngine;

public class AS_Offers : EditorWindow
{
    [MenuItem("Window/Asset Store Offers")]
    public static void ShowWindow()
    {
        GetWindow<AS_Offers>(false, "Asset Store Offers", true);
    }
    public static void DrawUILine(Color color, int thickness = 2, int padding = 10)
    {
        Rect r = EditorGUILayout.GetControlRect(GUILayout.Height(padding + thickness));
        r.height = thickness;
        r.y += padding / 2;
        r.x -= 2;
        r.width += 6;
        EditorGUI.DrawRect(r, color);
    }

    private const int windowWidth = 610;
    private const int windowHeight = 567;
    Vector2 _scrollPosition;
    public bool dontShow;

    void OnEnable()
    {
        titleContent = new GUIContent("Asset Store Offers");
        maxSize = new Vector2(windowWidth, windowHeight);
        minSize = maxSize;
                                
    }

    private void OnGUI()
    {
        
        Texture2D border = EditorGUIUtility.Load("Assets/TreePackVol.1/Editor/Textures/UI/Ads/border.psd") as Texture2D;
        Texture2D ad1 = EditorGUIUtility.Load("Assets/TreePackVol.1/Editor/Textures/UI/Ads/ad1.psd") as Texture2D;
        Texture2D ad2 = EditorGUIUtility.Load("Assets/TreePackVol.1/Editor/Textures/UI/Ads/ad2.psd") as Texture2D;
        Texture2D ad3 = EditorGUIUtility.Load("Assets/TreePackVol.1/Editor/Textures/UI/Ads/ad3.psd") as Texture2D;
        EditorGUILayout.Space();
        EditorGUILayout.HelpBox("See the asset store offers", MessageType.None);
        EditorGUILayout.Space();
            
        _scrollPosition = EditorGUILayout.BeginScrollView(_scrollPosition,
                     false,
                     false,
                     GUILayout.Width(windowWidth),
                     GUILayout.Height(windowHeight-20));        //---------Ad 1-------------------------------------------------
                                                                //  GUILayout.BeginVertical("Box");

        //_scrollPosition = EditorGUILayout.BeginScrollView(scrollViewRect, _scrollPosition, new Rect(0, 0, 2000, 2000));
       
        if (GUILayout.Button(border, "", GUILayout.Width(600), GUILayout.Height(130)))
        {
            Application.OpenURL("https://assetstore.unity.com/publishers/23606");
        }

        if (GUILayout.Button(ad1, "", GUILayout.Width(600), GUILayout.Height(130)))
        {
            Application.OpenURL("https://assetstore.unity.com/publishers/92929");
        }

        if (GUILayout.Button(ad2, "", GUILayout.Width(600), GUILayout.Height(130)))
        {
            Application.OpenURL("https://assetstore.unity.com/packages/templates/packs/complete-games-bundle-116482");
        }

        if (GUILayout.Button(ad3, "", GUILayout.Width(600), GUILayout.Height(130)))
        {
            Application.OpenURL("https://assetstore.unity.com/packages/tools/utilities/lighting-tools-107069");
        }

        EditorGUILayout.EndScrollView();

    }
}


[InitializeOnLoad]
public class Startup
{
    static Startup()
    {
        EditorPrefs.SetInt("showCounts_treeCol2017", EditorPrefs.GetInt("showCounts_treeCol2017") + 1);
        if (EditorPrefs.GetInt("showCounts_treeCol2017") == 100)    
        { 

            EditorApplication.ExecuteMenuItem("Window/Asset Store Offers");
        }

        // Rate me
        EditorPrefs.SetInt("showCounts_rateTreePack2017n", EditorPrefs.GetInt("showCounts_rateTreePack2017n") + 1);
        if (EditorPrefs.GetInt("showCounts_rateTreePack2017n") == 30)                 
        {   
            EditorApplication.ExecuteMenuItem("Window/Rate Asset");
        }
    }
} 
