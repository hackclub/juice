 using UnityEngine;
 using System.Collections;
 
 public class PlayRandomSound : MonoBehaviour {
 
     public AudioSource randomSound;
     public AudioClip[] audioSources;

     public int clipDelay = 5;
 
     // Use this for initialization
     void Start () {
 
         StartAudio ();
     }
 
 
     void StartAudio()
     {
         Invoke ("RandomSoundness", clipDelay);
     }
 
     void RandomSoundness()
     {
         randomSound.clip = audioSources[Random.Range(0, audioSources.Length)];
         randomSound.Play ();
         StartAudio ();
     }
 }