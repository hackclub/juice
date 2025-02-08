// ALIyerEdon@gmail.com - Writed at July 2021
// All rights reserved

using UnityEditor;
using UnityEngine;

public class Rate_Me : EditorWindow
{
    [MenuItem("Window/Rate Asset")]
    public static void ShowWindow()
    {
        GetWindow<Rate_Me>(false, "Rate Asset", true);
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
    private const int windowHeight = 300;
    Vector2 _scrollPosition;
    public bool dontShow;

    void OnEnable()
    {
        titleContent = new GUIContent("Rate the asset");
        maxSize = new Vector2(windowWidth, windowHeight);
        minSize = maxSize;
                        
    }

    private void OnGUI()
    {
        
        Texture2D border = EditorGUIUtility.Load("Assets/TreePackVol.1/Editor/Textures/UI/Ads/Rate_Border.psd") as Texture2D;
        Texture2D ad1 = EditorGUIUtility.Load("Assets/TreePackVol.1/Editor/Textures/UI/Ads/Rate_Asset.psd") as Texture2D;
       
        EditorGUILayout.Space();
        EditorGUILayout.HelpBox("Rate this asset", MessageType.None);
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
            Application.OpenURL("https://assetstore.unity.com/packages/slug/279185");
        }

        if (GUILayout.Button(ad1, "", GUILayout.Width(600), GUILayout.Height(130)))
        {
            Application.OpenURL("https://assetstore.unity.com/packages/slug/279185");
        }

        EditorGUILayout.EndScrollView();

    }
}
